import { ApiResultCode } from "../enums/api-result-code.enum";
import { ApiResultStatus } from "../enums/api-result-status.enum";

export interface ApiResultInfo {
  resultStatus: ApiResultStatus;
  resultCode: ApiResultCode;
  resultMsg: string;
}
