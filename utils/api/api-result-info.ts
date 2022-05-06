import { ApiResultInfo } from "./interfaces/api-result-info.interface";
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

export const UNAUTHORIZED_USER: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.UNAUTHORIZED_USER,
  resultMsg: "Unauthorized: Access is denied due to invalid credentials.",
};

export const UNAUTHENTICATED_USER: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.UNAUTHENTICATED_USER,
  resultMsg: "Authentication failed.",
};

export const AUTHORIZATION_HEADER_NOT_FOUND: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.AUTHORIZATION_HEADER_NOT_FOUND,
  resultMsg:
    "Unauthorized: Authentication failed because of missing Authorization header.",
};

export const BEARER_TOKEN_NOT_FOUND: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.BEARER_TOKEN_NOT_FOUND,
  resultMsg:
    "Unauthorized: Authentication failed because of missing Bearer token.",
};

export const INVALID_BASE64_STRING: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.INVALID_BASE64_STRING,
  resultMsg: "Invalid Base64 String.",
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

export const USERNAME_EXISTS: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.USERNAME_EXISTS,
  resultMsg: "Username is taken.",
};

export const FAILED_TO_CREATE_NEW_USER: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.FAILED_TO_CREATE_NEW_USER,
  resultMsg: "Failed to create new user.",
};

export const FAILED_TO_UPDATE_USER: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.FAILED_TO_UPDATE_USER,
  resultMsg: "Failed to update user.",
};

export const UPDATE_USER_DECLINED: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.UPDATE_USER_DECLINED,
  resultMsg: "Update declined.",
};

export const FAILED_TO_CREATE_NEW_GAME: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.FAILED_TO_CREATE_NEW_GAME,
  resultMsg: "Failed to create new game.",
};

export const INVALID_REQ_BODY_PARAMS: ApiResultInfo = {
  resultStatus: ApiResultStatus.FAILURE,
  resultCode: ApiResultCode.INVALID_REQ_PARAMS,
  resultMsg: "Invalid request parameters", // will get overwritten
};
