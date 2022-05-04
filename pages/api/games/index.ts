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
import { ApiResultCode } from "../../../utils/api/enums/api-result-code.enum";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const constraints = []; // @ref https://stackoverflow.com/a/69036032/12278028
  const reqBody: APIGamesRequest = req.body;
  const reqFunction: ApiRequestFunction = reqBody.request.head.function;
  let resBody: APIGamesResponse = {} as APIGamesResponse;

  if (req.method === "POST") {
    let game: DocumentData | undefined,
      games: DocumentData[] | undefined,
      lastKey: number | undefined;

    if (reqFunction === ApiRequestFunction.GAME_QUERY) {
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
    } else if (reqFunction === ApiRequestFunction.GAME_CREATE) {
      const newGame: Game = {
        userId: reqBody.request.body.userId as string,
        round: reqBody.request.body.round as number,
        score: reqBody.request.body.score as number,
        wpm: reqBody.request.body.wpm as number,
        words: reqBody.request.body.words as string[],
        dateCreated: Date.now(),
      };

      const gameQuery = await CreateGame(newGame);

      // Update high score
      const { user } = await GetUser(newGame.userId);

      if (user && newGame.score > user.highestScoringGame.score) {
        const { userId, ...filteredNewGameData } = newGame;

        const dataTobeUpdated = {
          highestScoringGame: {
            gameId: gameQuery.game.id,
            ...filteredNewGameData,
          },
        };

        await UpdateUser(newGame.userId, dataTobeUpdated);
      }

      game = gameQuery.game;
    } else {
      resBody = {
        response: {
          head: {
            function: reqFunction,
          },
          body: {
            resultInfo: {
              resultStatus: ApiResultStatus.FAILURE,
              resultCode: ApiResultCode.REQ_FUNC_NOT_SUPPORTED,
              resultMsg: "Request function not supported.",
            },
          },
        },
      };
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: {
            resultStatus: ApiResultStatus.SUCCESS,
            resultCode: ApiResultCode.REQ_SUCCESS,
            resultMsg: ApiResultStatus.SUCCESS,
          },
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
          resultInfo: {
            resultStatus: ApiResultStatus.FAILURE,
            resultCode: ApiResultCode.REQ_HTTP_METHOD_NOT_SUPPORTED,
            resultMsg: "HTTP request method not supported.",
          },
        },
      },
    };
  }

  const resultCode = resBody.response.body.resultInfo.resultStatus;

  res.status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400).json(resBody);
}
