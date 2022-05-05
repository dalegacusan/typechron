import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const GAME_CREATE_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.GAME_CREATE]),
    }),
    body: z.object({
      userId: z.string().nonempty(),
      round: z.number().int(),
      score: z.number().int(),
      wpm: z.number(),
      words: z.array(z.string().nonempty()).nonempty(),
    }),
    signature: z.string().nonempty(),
  }),
});

export type GAME_CREATE_TYPE = z.infer<typeof GAME_CREATE_SCHEMA>;
