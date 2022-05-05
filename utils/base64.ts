import { encode, decode } from "js-base64";

export const ToBase64 = (data: string): string => encode(data);

export const FromBase64 = (data: string): string => decode(data);
