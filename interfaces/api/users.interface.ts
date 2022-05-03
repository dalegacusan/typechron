import { DocumentData } from "firebase/firestore";
import { ApiRequestFunction } from "../../enums/api/api-request-function.enum";
import { ApiResultCode } from "../../enums/api/api-result-code.enum";
import { ApiResultStatus } from "../../enums/api/api-result-status.enum";

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
      resultInfo: {
        resultStatus: ApiResultStatus;
        resultCode: ApiResultCode;
        resultMsg: string;
      };
      user?: DocumentData; // Type User
    };
  };
}
