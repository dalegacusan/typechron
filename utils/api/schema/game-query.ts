import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";
import { QueryOrderDirection } from "../enums/query-order-direction.enum";

export const GAME_QUERY_USER_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.GAME_QUERY_USER]),
    }),
    body: z.object({
      limit: z.number().int(),
      orderBy: z.object({
        direction: z.enum([QueryOrderDirection.ASC, QueryOrderDirection.DESC]),
        fieldPath: z.string().nonempty(),
      }),
      userId: z.string().nonempty(),
      lastKey: z.number().int().optional(),
    }),
  }),
});

export type GAME_QUERY_USER_TYPE = z.infer<typeof GAME_QUERY_USER_SCHEMA>;
