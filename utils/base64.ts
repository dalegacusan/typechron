import { encode, decode, isValid } from "js-base64";

export const ToBase64 = (data: string): string => encode(data);

export const FromBase64 = (data: string): string => decode(data);

export const IsValidBase64String = (data: string): boolean => isValid(data);
