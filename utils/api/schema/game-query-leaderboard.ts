import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const GAME_QUERY_LEADERBOARD_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.GAME_QUERY_LEADERBOARD]),
    }),
  }),
});

export type GAME_QUERY_LEADERBOARD_TYPE = z.infer<
  typeof GAME_QUERY_LEADERBOARD_SCHEMA
>;
