import { DocumentData } from "firebase/firestore";
import type { NextApiResponse } from "next";
import type { NextApiRequestWithIdToken } from "../../../utils/api/types/next-api-request-with-id-token.type";
import { ApiRequestFunction } from "../../../utils/api/enums/api-request-function.enum";
import { APIUsersResponse } from "../../../utils/api/interfaces/users.interface";
import { ApiResultStatus } from "../../../utils/api/enums/api-result-status.enum";
import { User } from "../../../interfaces/user.interface";
import {
  CreateUser,
  GetUser,
  GetUserByUsername,
  UpdateLeaderboardUsernames,
  UpdateUser,
} from "../../../utils/firebase-functions";
import { AddOneDayFromUnixTimestamp } from "../../../utils/time";
import { GenerateUsername } from "../../../utils/words";
import {
  FAILED_TO_CREATE_NEW_USER,
  FAILED_TO_UPDATE_USER,
  INVALID_REQ_BODY_PARAMS,
  REQ_FUNC_NOT_SUPPORTED,
  REQ_HTTP_METHOD_NOT_SUPPORTED,
  REQ_SUCCESS,
  UNAUTHENTICATED_USER,
  UPDATE_USER_DECLINED,
  USERNAME_EXISTS,
  USER_NOT_ALLOWED_TO_CHANGE_USERNAME,
  USER_NOT_FOUND,
} from "../../../utils/api/api-result-info";
import { ApiResultInfo } from "../../../utils/api/interfaces/api-result-info.interface";
import {
  USER_QUERY_SCHEMA,
  USER_QUERY_TYPE,
} from "../../../utils/api/schema/user-query";
import {
  USER_CREATE_SCHEMA,
  USER_CREATE_TYPE,
} from "../../../utils/api/schema/user-create";
import {
  USER_UPDATE_SCHEMA,
  USER_UPDATE_TYPE,
} from "../../../utils/api/schema/user-update";
import { withAuth } from "../../../utils/api/middlewares/withAuth.middleware";
import { accountUpdateLimit } from "../../../config/app";

const handler = async (
  req: NextApiRequestWithIdToken,
  res: NextApiResponse
) => {
  const reqFunction: ApiRequestFunction = req.body?.request?.head?.function;
  let resBody: APIUsersResponse = {} as APIUsersResponse;
  let resInfo: ApiResultInfo = {} as ApiResultInfo;

  if (req.method === "POST") {
    let user: DocumentData | undefined;

    if (reqFunction === ApiRequestFunction.USER_QUERY) {
      const reqBody: USER_QUERY_TYPE = req.body;
      const userQuerySchema = USER_QUERY_SCHEMA;
      const schemaResult = userQuerySchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        if (reqBody.request.body.userId !== req.uid) {
          resInfo = UNAUTHENTICATED_USER;
        } else {
          const query = await GetUser(reqBody.request.body.userId);

          if (query.user) {
            const { email, lowercaseUsername, ...userData } = query.user;

            user = userData;

            resInfo = REQ_SUCCESS;
          } else {
            resInfo = USER_NOT_FOUND;
          }
        }
      }
    } else if (reqFunction === ApiRequestFunction.USER_CREATE) {
      const reqBody: USER_CREATE_TYPE = req.body;
      const userCreateSchema = USER_CREATE_SCHEMA;
      const schemaResult = userCreateSchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        if (reqBody.request.body.userId !== req.uid) {
          resInfo = UNAUTHENTICATED_USER;
        } else {
          const defaultUsername = GenerateUsername();
          const dateCreated = Date.now();

          const newUser: User = {
            id: reqBody.request.body.userId,
            email: reqBody.request.body.email,
            username: defaultUsername,
            lowercaseUsername: defaultUsername.toLowerCase(),
            dateCreated,
            dateUpdated: dateCreated,
            updateCount: 0,
            highestScoringGame: {
              gameId: "",
              round: 0,
              score: 0,
              wpm: 0,
              words: [],
              dateCreated,
            },
          };

          if (reqBody.request.body.username) {
            newUser.username = reqBody.request.body.username;
            newUser.lowercaseUsername =
              reqBody.request.body.username.toLowerCase();
          }

          const query = await CreateUser(newUser);

          if (query.user) {
            const { email, lowercaseUsername, ...userData } = query.user;

            user = userData;

            resInfo = REQ_SUCCESS;
          } else {
            resInfo = FAILED_TO_CREATE_NEW_USER;
          }
        }
      }
    } else {
      resInfo = REQ_FUNC_NOT_SUPPORTED;
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: resInfo,
          user,
        },
      },
    };
  } else if (req.method === "PUT") {
    if (reqFunction === ApiRequestFunction.USER_UPDATE) {
      const reqBody: USER_UPDATE_TYPE = req.body;
      const userUpdateSchema = USER_UPDATE_SCHEMA;
      const schemaResult = userUpdateSchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        if (reqBody.request.body.userId !== req.uid) {
          resInfo = UNAUTHENTICATED_USER;
        } else {
          const userQuery = await GetUser(reqBody.request.body.userId);

          if (!userQuery.user) {
            resInfo = USER_NOT_FOUND;
          } else {
            // Check if can still update account details
            if (userQuery.user.updateCount >= accountUpdateLimit) {
              resInfo = UPDATE_USER_DECLINED;
            } else {
              const usernameQuery = await GetUserByUsername(
                reqBody.request.body.username
              );

              if (!usernameQuery.user) {
                // Check if one day has passed from account creation date
                const oneDayFromCreation = AddOneDayFromUnixTimestamp(
                  userQuery.user.dateCreated
                );
                const isOneDayPassed = Date.now() > oneDayFromCreation;

                if (!isOneDayPassed) {
                  resInfo = USER_NOT_ALLOWED_TO_CHANGE_USERNAME;
                } else {
                  const dataToBeUpdated = {
                    username: reqBody.request.body.username,
                    lowercaseUsername:
                      reqBody.request.body.username.toLowerCase(),
                    dateUpdated: Date.now(),
                    updateCount: userQuery.user.updateCount + 1,
                  };

                  const updatedUser = await UpdateUser(
                    reqBody.request.body.userId,
                    dataToBeUpdated
                  );

                  if (updatedUser.user) {
                    resInfo = REQ_SUCCESS;

                    // Update username in Leaderboard collection (if user has a leaderboard record)
                    await UpdateLeaderboardUsernames(
                      userQuery.user.id,
                      dataToBeUpdated.username
                    );
                  } else {
                    resInfo = FAILED_TO_UPDATE_USER;
                  }
                }
              } else {
                resInfo = USERNAME_EXISTS;
              }
            }
          }
        }
      }
    } else {
      resInfo = REQ_FUNC_NOT_SUPPORTED;
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: resInfo,
        },
      },
    };
  } else {
    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: REQ_HTTP_METHOD_NOT_SUPPORTED,
        },
      },
    };
  }

  const resultCode = resBody.response.body.resultInfo.resultStatus;

  return res
    .status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400)
    .json(resBody);
};

export default withAuth(handler);
