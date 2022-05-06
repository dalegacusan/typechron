import { z } from "zod";
import { usernameMaxLength } from "../../../config/app";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const USER_CREATE_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.USER_CREATE]),
    }),
    body: z.object({
      userId: z.string().nonempty(),
      email: z.string().nonempty().email(),
      username: z.string().nonempty().max(usernameMaxLength).optional(),
    }),
  }),
});

export type USER_CREATE_TYPE = z.infer<typeof USER_CREATE_SCHEMA>;
