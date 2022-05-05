import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const USER_QUERY_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.USER_QUERY]),
    }),
    body: z.object({
      userId: z.string(),
    }),
  }),
});

export type USER_QUERY_TYPE = z.infer<typeof USER_QUERY_SCHEMA>;
