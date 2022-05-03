import { DocumentData, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiRequestFunction } from "../../../enums/api-request-function.enum";
import { ApiResultStatus } from "../../../enums/api-result-status.enum";
import {
  APIUsersRequest,
  APIUsersResponse,
} from "../../../interfaces/api/users.interface";
import { User } from "../../../interfaces/user.interface";
import { CreateUser, GetUser } from "../../../utils/firebase-functions";
import { CreateSignature } from "../../../utils/hash";
import { GenerateUsername } from "../../../utils/words";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const constraints = []; // @ref https://stackoverflow.com/a/69036032/12278028
  const reqBody: APIUsersRequest = req.body;
  const reqFunction: ApiRequestFunction = reqBody.request.head.function;
  let resBody: APIUsersResponse = {} as APIUsersResponse;

  if (req.method === "POST") {
    let user: DocumentData | undefined;

    if (reqFunction === ApiRequestFunction.USER_QUERY) {
      constraints.push(where("id", "==", reqBody.request.body.userId));

      const query = await GetUser(constraints);

      user = query.user;
    } else if (reqFunction === ApiRequestFunction.USER_CREATE) {
      const defaultUsername = GenerateUsername();

      const newUser: User = {
        id: reqBody.request.body.userId as string,
        email: reqBody.request.body.email as string,
        username: defaultUsername,
        dateCreated: Date.now(),
      };

      if (reqBody.request.body.username) {
        newUser.username = reqBody.request.body.username;
      }

      const query = await CreateUser(newUser);

      user = query.user;
    } else {
      resBody = {
        response: {
          head: {
            function: reqFunction,
          },
          body: {
            resultInfo: {
              resultStatus: ApiResultStatus.FAILURE,
              resultMsg: "Request function not supported.",
            },
          },
        },
        signature: "",
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
            resultMsg: ApiResultStatus.SUCCESS,
          },
          user,
        },
      },
      signature: "",
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
            resultMsg: "HTTP request method not supported.",
          },
        },
      },
      signature: "",
    };
  }

  // Create signature
  const dataToSign = {
    head: resBody.response.head,
    body: resBody.response.body,
  };

  resBody.signature = CreateSignature(JSON.stringify(dataToSign)).toString(
    "base64"
  );

  const resultCode = resBody.response.body.resultInfo.resultStatus;

  res.status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400).json(resBody);
}
