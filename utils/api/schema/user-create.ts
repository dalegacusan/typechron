import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const USER_CREATE_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.USER_CREATE]),
    }),
    body: z.object({
      userId: z.string(),
      email: z.string().email(),
      username: z.string().min(1).max(8).optional(),
    }),
  }),
});

export type USER_CREATE_TYPE = z.infer<typeof USER_CREATE_SCHEMA>;
