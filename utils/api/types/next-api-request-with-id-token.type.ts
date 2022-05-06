import { NextApiRequest } from "next";

export type NextApiRequestWithIdToken = NextApiRequest & {
  uid: string;
};
