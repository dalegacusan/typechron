import {
  DocumentData,
  limit,
  orderBy,
  OrderByDirection,
  startAfter,
  where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiRequestFunction } from "../../../enums/api-request-function.enum";
import { ApiResultCode } from "../../../enums/api-result-code.enum";
import {
  APIGamesRequest,
  APIGamesResponse,
} from "../../../interfaces/api/games.interface";
import { Game } from "../../../interfaces/game.interface";
import { CreateGame, GetGames } from "../../../utils/firebase-functions";
import { v4 as uuidv4 } from "uuid";
import { CreateSignature } from "../../../utils/hash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const constraints = []; // @ref https://stackoverflow.com/a/69036032/12278028
  const reqBody: APIGamesRequest = req.body;
  const reqFunction: ApiRequestFunction = reqBody.request.head.function;
  let resBody: APIGamesResponse = {} as APIGamesResponse;

  if (req.method === "POST") {
    let game: Game | undefined,
      games: DocumentData[] | undefined,
      lastKey: number | undefined;

    if (reqFunction === ApiRequestFunction.GAME_QUERY) {
      if (reqBody.request.body.userId) {
        constraints.push(where("userId", "==", reqBody.request.body.userId));
      }

      constraints.push(
        orderBy(
          "score",
          reqBody.request.body.orderBy.toLowerCase() as OrderByDirection
        )
      );

      if (reqBody.request.body.lastKey) {
        constraints.push(startAfter(reqBody.request.body.lastKey));
      }

      constraints.push(limit(reqBody.request.body.limit));

      const query = await GetGames(constraints);

      games = query.games;
      lastKey = query.lastKey;
    } else if (reqFunction === ApiRequestFunction.GAME_CREATE) {
      const newGame: Game = {
        id: uuidv4(),
        userId: reqBody.request.body.userId as string,
        round: reqBody.request.body.round as number,
        score: reqBody.request.body.score as number,
        wpm: reqBody.request.body.wpm as number,
        words: reqBody.request.body.words as string[],
        dateCreated: Date.now(),
      };

      const query = await CreateGame(newGame);

      game = query.game;
    } else {
      resBody = {
        response: {
          head: {
            function: reqFunction,
          },
          body: {
            resultInfo: {
              resultCode: ApiResultCode.FAILURE,
            },
          },
        },
        signature: "",
      };
    }

    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: {
            resultCode: ApiResultCode.SUCCESS,
          },
          game,
          games,
          lastKey,
        },
      },
      signature: "",
    };
  } else {
    resBody = {
      response: {
        head: {
          function: reqFunction,
        },
        body: {
          resultInfo: {
            resultCode: ApiResultCode.FAILURE,
          },
        },
      },
      signature: "",
    };
  }

  // Create signature
  resBody.signature = CreateSignature(JSON.stringify(resBody)).toString(
    "base64"
  );

  const resultCode = resBody.response.body.resultInfo.resultCode;

  res.status(resultCode === ApiResultCode.SUCCESS ? 200 : 400).json(resBody);
}
