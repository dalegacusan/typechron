// @ref https://dev.to/dingran/next-js-firebase-authentication-and-middleware-for-api-routes-29m1

import { NextApiRequest, NextApiResponse } from "next";
import { VerifyIdToken } from "../../../config/firebase-admin";
import { FromBase64 } from "../../base64";
import {
  AUTHORIZATION_HEADER_NOT_FOUND,
  BEARER_TOKEN_NOT_FOUND,
  UNAUTHENTICATED_USER,
} from "../api-result-info";

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const resBody = {
      response: {
        head: {
          function: req.body?.request?.head?.function,
        },
        body: {
          resultInfo: UNAUTHENTICATED_USER,
        },
      },
    };

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

    return handler(req, res);
  };
}
