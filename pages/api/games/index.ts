import {
  DocumentData,
  limit,
  orderBy,
  OrderByDirection,
  startAfter,
  where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiRequestFunction } from "../../../utils/api/enums/api-request-function.enum";
import {
  APIGamesRequest,
  APIGamesResponse,
} from "../../../interfaces/api/games.interface";
import { Game } from "../../../interfaces/game.interface";
import {
  CreateGame,
  GetGames,
  GetUser,
  UpdateUser,
} from "../../../utils/firebase-functions";
import { ApiResultStatus } from "../../../utils/api/enums/api-result-status.enum";
import { ApiResultInfo } from "../../../interfaces/api/api-result-info.interface";
import {
  FAILED_TO_CREATE_NEW_GAME,
  INVALID_REQ_BODY_PARAMS,
  REQ_FUNC_NOT_SUPPORTED,
  REQ_HTTP_METHOD_NOT_SUPPORTED,
  REQ_SUCCESS,
  USER_NOT_FOUND,
} from "../../../utils/api/api-result-info";
import {
  GAME_QUERY_SCHEMA,
  GAME_QUERY_TYPE,
} from "../../../utils/api/schema/game-query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const constraints = []; // @ref https://stackoverflow.com/a/69036032/12278028
  const reqFunction: ApiRequestFunction = req.body?.request?.head?.function;
  let resBody: APIGamesResponse = {} as APIGamesResponse;
  let resInfo: ApiResultInfo = {} as ApiResultInfo;

  if (req.method === "POST") {
    let game: DocumentData | undefined,
      games: DocumentData[] | undefined,
      lastKey: number | undefined;

    if (reqFunction === ApiRequestFunction.GAME_QUERY) {
      const reqBody: GAME_QUERY_TYPE = req.body;
      const gameQuerySchema = GAME_QUERY_SCHEMA;
      const schemaResult = gameQuerySchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        if (reqBody.request.body.userId) {
          constraints.push(where("userId", "==", reqBody.request.body.userId));
        }

        constraints.push(
          orderBy(
            reqBody.request.body.orderBy.fieldPath,
            reqBody.request.body.orderBy.direction.toLowerCase() as OrderByDirection
          )
        );

        // Handle 2 similar "orderBy" to field "dateCreated"
        // For My Account page, must use only "dateCreated" field path
        // For Leaderboards page, must use both "score" and "dateCreated" field paths
        if (reqBody.request.body.orderBy.fieldPath !== "dateCreated") {
          constraints.push(
            orderBy(
              "dateCreated",
              reqBody.request.body.orderBy.direction.toLowerCase() as OrderByDirection
            )
          );
        }

        if (reqBody.request.body.lastKey) {
          constraints.push(startAfter(reqBody.request.body.lastKey));
        }

        constraints.push(limit(reqBody.request.body.limit));

        const query = await GetGames(constraints);

        games = query.games;
        lastKey = query.lastKey;

        resInfo = REQ_SUCCESS;
      }
    } else if (reqFunction === ApiRequestFunction.GAME_CREATE) {
      const userQuery = await GetUser(reqBody.request.body.userId as string);

      if (userQuery.user) {
        const newGame: Game = {
          userId: reqBody.request.body.userId as string,
          round: reqBody.request.body.round as number,
          score: reqBody.request.body.score as number,
          wpm: reqBody.request.body.wpm as number,
          words: reqBody.request.body.words as string[],
          dateCreated: Date.now(),
        };

        const gameQuery = await CreateGame(newGame);

        if (gameQuery.game) {
          game = gameQuery.game;

          resInfo = REQ_SUCCESS;

          // Check if new high score
          if (newGame.score > userQuery.user.highestScoringGame.score) {
            const { userId, ...filteredNewGameData } = newGame;

            const dataTobeUpdated = {
              highestScoringGame: {
                gameId: gameQuery.game.id,
                ...filteredNewGameData,
              },
            };

            await UpdateUser(newGame.userId, dataTobeUpdated);
          }
        } else {
          resInfo = FAILED_TO_CREATE_NEW_GAME;
        }
      } else {
        resInfo = USER_NOT_FOUND;
      }
    } else {
      resInfo = REQ_FUNC_NOT_SUPPORTED;
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: resInfo,
          game,
          games,
          lastKey,
        },
      },
    };
  } else {
    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: REQ_HTTP_METHOD_NOT_SUPPORTED,
        },
      },
    };
  }

  const resultCode = resBody.response.body.resultInfo.resultStatus;

  res.status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400).json(resBody);
}
