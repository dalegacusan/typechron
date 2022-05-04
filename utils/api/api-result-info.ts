import { ApiResultInfo } from "../../interfaces/api/api-result-info.interface";
import { ApiResultCode } from "./enums/api-result-code.enum";
import { ApiResultStatus } from "./enums/api-result-status.enum";

export const REQ_SUCCESS: ApiResultInfo = {
  resultStatus: ApiResultStatus.SUCCESS,
  resultCode: ApiResultCode.REQ_SUCCESS,
  resultMsg: ApiResultStatus.SUCCESS,
};

export const REQ_FUNC_NOT_SUPPORTED: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.REQ_FUNC_NOT_SUPPORTED,
  resultMsg: "Request function not supported.",
};

export const REQ_HTTP_METHOD_NOT_SUPPORTED: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.REQ_HTTP_METHOD_NOT_SUPPORTED,
  resultMsg: "HTTP request method not supported.",
};

export const USER_NOT_FOUND: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.USER_NOT_FOUND,
  resultMsg: "User does not exist.",
};

export const USER_NOT_ALLOWED_TO_CHANGE_USERNAME: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.USER_NOT_ALLOWED_TO_CHANGE_USERNAME,
  resultMsg: "User is not allowed to change their username.",
};

export const FAILED_TO_CREATE_NEW_USER: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.FAILED_TO_CREATE_NEW_USER,
  resultMsg: "Failed to create new user.",
};
