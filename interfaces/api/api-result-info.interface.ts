import { ApiResultCode } from "../../utils/api/enums/api-result-code.enum";
import { ApiResultStatus } from "../../utils/api/enums/api-result-status.enum";

export interface ApiResultInfo {
  resultStatus: ApiResultStatus;
  resultCode: ApiResultCode;
  resultMsg: string;
}
