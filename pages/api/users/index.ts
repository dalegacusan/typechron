import { DocumentData } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiRequestFunction } from "../../../enums/api/api-request-function.enum";
import { ApiResultCode } from "../../../enums/api/api-result-code.enum";
import { ApiResultStatus } from "../../../enums/api/api-result-status.enum";
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
import { GenerateUsername } from "../../../utils/words";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqBody: APIUsersRequest = req.body;
  const reqFunction: ApiRequestFunction = reqBody.request.head.function;
  let resBody: APIUsersResponse = {} as APIUsersResponse;

  if (req.method === "POST") {
    let user: DocumentData | undefined;

    if (reqFunction === ApiRequestFunction.USER_QUERY) {
      const query = await GetUser(reqBody.request.body.userId as string);

      // @ts-ignore
      if (query.user) {
        const { email, ...userData } = query.user;

        user = userData;
      } else {
        user = query.user;
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

      const { email, ...userData } = query.user;

      user = userData;
    } else {
      resBody = {
        response: {
          head: {
            function: reqFunction,
          },
          body: {
            resultInfo: {
              resultStatus: ApiResultStatus.FAILURE,
              resultCode: ApiResultCode.REQ_FUNC_NOT_SUPPORTED,
              resultMsg: "Request function not supported.",
            },
          },
        },
      };
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: {
            resultStatus: ApiResultStatus.SUCCESS,
            resultCode: ApiResultCode.REQ_SUCCESS,
            resultMsg: ApiResultStatus.SUCCESS,
          },
          user,
        },
      },
    };
  } else if (req.method === "PUT") {
    const resultInfo = {
      resultStatus: ApiResultStatus.SUCCESS,
      resultCode: ApiResultCode.REQ_SUCCESS,
      resultMsg: ApiResultStatus.SUCCESS,
    };

    // TODO
    // 1. Username must be 8 chars
    // 2. User can only change username up to 3 times
    // 3. User can update username after 1 day

    const dataTobeUpdated = {
      username: reqBody.request.body.username,
    };

    await UpdateUser(reqBody.request.body.userId as string, dataTobeUpdated);

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo,
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
          resultInfo: {
            resultStatus: ApiResultStatus.FAILURE,
            resultCode: ApiResultCode.REQ_HTTP_METHOD_NOT_SUPPORTED,
            resultMsg: "HTTP request method not supported.",
          },
        },
      },
    };
  }

  const resultCode = resBody.response.body.resultInfo.resultStatus;

  res.status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400).json(resBody);
}
