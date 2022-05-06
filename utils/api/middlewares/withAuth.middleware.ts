// @ref https://dev.to/dingran/next-js-firebase-authentication-and-middleware-for-api-routes-29m1

import { NextApiResponse } from "next";
import { NextApiRequestWithIdToken } from "../types/next-api-request-with-id-token.type";
import { VerifyIdToken } from "../../../config/firebase-admin";
import { FromBase64 } from "../../base64";
import {
  AUTHORIZATION_HEADER_NOT_FOUND,
  BEARER_TOKEN_NOT_FOUND,
  REQ_FUNC_NOT_SUPPORTED,
  UNAUTHENTICATED_USER,
} from "../api-result-info";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export function withAuth(handler: any) {
  return async (req: NextApiRequestWithIdToken, res: NextApiResponse) => {
    const reqFunction: ApiRequestFunction = req.body?.request?.head?.function;
    const resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: UNAUTHENTICATED_USER,
        },
      },
    };

    if (reqFunction) {
      if (reqFunction !== ApiRequestFunction.GAME_QUERY_LEADERBOARDS) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          resBody.response.body.resultInfo = AUTHORIZATION_HEADER_NOT_FOUND;

          return res.status(401).json(resBody);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          resBody.response.body.resultInfo = BEARER_TOKEN_NOT_FOUND;

          return res.status(401).json(resBody);
        }

        try {
          const decodedToken = await VerifyIdToken(FromBase64(token));

          if (!decodedToken || !decodedToken.uid) {
            return res.status(401).json(resBody);
          }

          req.uid = decodedToken.uid;
        } catch (error) {
          return res.status(401).json(resBody);
        }
      }
    } else {
      resBody.response.body.resultInfo = REQ_FUNC_NOT_SUPPORTED;

      return res.status(401).json(resBody);
    }

    return handler(req, res);
  };
}
