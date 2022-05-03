import { sign, verify } from "crypto";
import * as fs from "fs";

export const CreateSignature = (data: string): Buffer => {
  // @ref https://stackoverflow.com/a/63249442
  const key = fs.readFileSync("signature.private.pem", {
    encoding: "utf8",
  });

  return sign("sha256", Buffer.from(data), {
    key,
  });
};

export const VerifySignature = (data: string, signature: Buffer): boolean => {
  // @ref https://stackoverflow.com/a/63249442
  const key = fs.readFileSync("signature.private.pem", {
    encoding: "utf8",
  });

  return verify(
    "sha256",
    Buffer.from(data),
    {
      key,
    },
    signature
  );
};
