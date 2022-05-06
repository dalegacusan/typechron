import { ApiRequestFunction } from "../enums/api-request-function.enum";
import { ApiResultInfo } from "./api-result-info.interface";
import { DocumentData } from "firebase/firestore";

export interface APIUsersRequest {
  request: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      userId?: string;
      email?: string;
      username?: string;
    };
  };
}

export interface APIUsersResponse {
  response: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      resultInfo: ApiResultInfo;
      user?: DocumentData; // Type User
    };
  };
}
