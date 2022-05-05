import { DocumentData } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiRequestFunction } from "../../../utils/api/enums/api-request-function.enum";
import { ApiResultStatus } from "../../../utils/api/enums/api-result-status.enum";
import {
  APIUsersRequest,
  APIUsersResponse,
} from "../../../interfaces/api/users.interface";
import { User } from "../../../interfaces/user.interface";
import {
  CreateUser,
  GetUser,
  UpdateUser,
} from "../../../utils/firebase-functions";
import { AddOneDayFromUnixTimestamp } from "../../../utils/time";
import { GenerateUsername } from "../../../utils/words";
import {
  FAILED_TO_CREATE_NEW_USER,
  REQ_FUNC_NOT_SUPPORTED,
  REQ_HTTP_METHOD_NOT_SUPPORTED,
  REQ_SUCCESS,
  USER_NOT_ALLOWED_TO_CHANGE_USERNAME,
  USER_NOT_FOUND,
} from "../../../utils/api/api-result-info";
import { ApiResultInfo } from "../../../interfaces/api/api-result-info.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqBody: APIUsersRequest = req.body;
  const reqFunction: ApiRequestFunction = reqBody.request.head.function;
  let resBody: APIUsersResponse = {} as APIUsersResponse;
  let resInfo: ApiResultInfo = {} as ApiResultInfo;

  if (req.method === "POST") {
    let user: DocumentData | undefined;

    if (reqFunction === ApiRequestFunction.USER_QUERY) {
      const query = await GetUser(reqBody.request.body.userId as string);

      if (query.user) {
        const { email, ...userData } = query.user;

        user = userData;

        resInfo = REQ_SUCCESS;
      } else {
        resInfo = USER_NOT_FOUND;
      }
    } else if (reqFunction === ApiRequestFunction.USER_CREATE) {
      const defaultUsername = GenerateUsername();
      const dateCreated = Date.now();

      const newUser: User = {
        id: reqBody.request.body.userId as string,
        email: reqBody.request.body.email as string,
        username: defaultUsername,
        dateCreated,
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
      }

      const query = await CreateUser(newUser);

      if (query.user) {
        const { email, ...userData } = query.user;

        user = userData;

        resInfo = REQ_SUCCESS;
      } else {
        resInfo = FAILED_TO_CREATE_NEW_USER;
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
      const query = await GetUser(reqBody.request.body.userId as string);

      if (query.user) {
        // Check if one day has passed from account creation date
        const oneDayFromCreation = AddOneDayFromUnixTimestamp(
          query.user.dateCreated
        );
        const isOneDayPassed = Date.now() > oneDayFromCreation;

        if (!isOneDayPassed) {
          resInfo = USER_NOT_ALLOWED_TO_CHANGE_USERNAME;
        } else {
          const dataTobeUpdated = {
            username: reqBody.request.body.username,
          };

          await UpdateUser(
            reqBody.request.body.userId as string,
            dataTobeUpdated
          );

          resInfo = REQ_SUCCESS;
        }
      } else {
        resInfo = USER_NOT_FOUND;
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

  res.status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400).json(resBody);
}
