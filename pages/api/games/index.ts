import {
  DocumentData,
  limit,
  orderBy,
  OrderByDirection,
  startAfter,
  where,
} from "firebase/firestore";
import type { NextApiResponse } from "next";
import type { NextApiRequestWithIdToken } from "../../../utils/api/types/next-api-request-with-id-token.type";
import { ApiRequestFunction } from "../../../utils/api/enums/api-request-function.enum";
import { APIGamesResponse } from "../../../utils/api/interfaces/games.interface";
import { Game } from "../../../interfaces/game.interface";
import {
  CreateGame,
  DeleteLeaderboardGame,
  GetGames,
  GetLeaderboardGames,
  GetUser,
  UpdateUser,
} from "../../../utils/firebase-functions";
import { ApiResultStatus } from "../../../utils/api/enums/api-result-status.enum";
import { ApiResultInfo } from "../../../utils/api/interfaces/api-result-info.interface";
import {
  FAILED_TO_ADD_GAME_TO_LEADERBOARD,
  FAILED_TO_CREATE_NEW_GAME,
  FAILED_TO_UPDATE_USER,
  INVALID_REQ_BODY_PARAMS,
  REQ_FUNC_NOT_SUPPORTED,
  REQ_HTTP_METHOD_NOT_SUPPORTED,
  REQ_SUCCESS,
  UNAUTHENTICATED_USER,
  USER_NOT_FOUND,
} from "../../../utils/api/api-result-info";
import {
  GAME_QUERY_SCHEMA,
  GAME_QUERY_TYPE,
} from "../../../utils/api/schema/game-query";
import {
  GAME_CREATE_SCHEMA,
  GAME_CREATE_TYPE,
} from "../../../utils/api/schema/game-create";
import {
  GAME_QUERY_LEADERBOARD_SCHEMA,
  GAME_QUERY_LEADERBOARD_TYPE,
} from "../../../utils/api/schema/game-query-leaderboard";
import { withAuth } from "../../../utils/api/middlewares/withAuth.middleware";
import { defaultGamesToDisplayCount } from "../../../config/app";
import { DatabaseCollection } from "../../../utils/api/enums/database-collection.enum";

const handler = async (
  req: NextApiRequestWithIdToken,
  res: NextApiResponse
) => {
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
        if (reqBody.request.body.userId !== req.uid) {
          resInfo = UNAUTHENTICATED_USER;
        } else {
          constraints.push(where("userId", "==", reqBody.request.body.userId));
          constraints.push(
            orderBy(
              reqBody.request.body.orderBy.fieldPath,
              reqBody.request.body.orderBy.direction.toLowerCase() as OrderByDirection
            )
          );

          if (reqBody.request.body.lastKey) {
            constraints.push(startAfter(reqBody.request.body.lastKey));
          }

          constraints.push(limit(reqBody.request.body.limit));

          const query = await GetGames(constraints);

          games = query.games;
          lastKey = query.lastKey;

          resInfo = REQ_SUCCESS;
        }
      }
    } else if (reqFunction === ApiRequestFunction.GAME_QUERY_LEADERBOARD) {
      const reqBody: GAME_QUERY_LEADERBOARD_TYPE = req.body;
      const gameQueryLeaderboardSchema = GAME_QUERY_LEADERBOARD_SCHEMA;
      const schemaResult = gameQueryLeaderboardSchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        const leaderboardGamesQuery = await GetLeaderboardGames();

        games = leaderboardGamesQuery.games.map((lbGame: Game) => {
          const { id, gameId, userId, username, ...tempGame } = lbGame;

          return {
            id: gameId,
            user: {
              id: lbGame.userId,
              username,
            },
            ...tempGame,
          };
        });

        resInfo = REQ_SUCCESS;
      }
    } else if (reqFunction === ApiRequestFunction.GAME_CREATE) {
      const reqBody: GAME_CREATE_TYPE = req.body;
      const gameCreateSchema = GAME_CREATE_SCHEMA;
      const schemaResult = gameCreateSchema.safeParse(reqBody);

      if (!schemaResult.success) {
        const tempResInfo = INVALID_REQ_BODY_PARAMS;
        const paramPath = schemaResult.error.issues[0].path.join(".");

        tempResInfo.resultMsg = `Invalid ${paramPath}.`;

        resInfo = tempResInfo;
      } else {
        if (reqBody.request.body.userId !== req.uid) {
          resInfo = UNAUTHENTICATED_USER;
        } else {
          const userQuery = await GetUser(reqBody.request.body.userId);

          if (userQuery.user) {
            const newGame: Game = {
              userId: reqBody.request.body.userId,
              round: reqBody.request.body.round,
              score: reqBody.request.body.score,
              wpm: reqBody.request.body.wpm,
              words: reqBody.request.body.words,
              dateCreated: Date.now(),
            };

            const gameQuery = await CreateGame(
              newGame,
              DatabaseCollection.GAMES
            );

            if (gameQuery.game) {
              game = gameQuery.game;

              resInfo = REQ_SUCCESS;

              // Check if new game is user's new high score
              if (newGame.score > userQuery.user.highestScoringGame.score) {
                const { userId, ...filteredNewGameData } = newGame;

                const dataTobeUpdated = {
                  highestScoringGame: {
                    gameId: gameQuery.game.id,
                    ...filteredNewGameData,
                  },
                };

                const updatedUser = await UpdateUser(
                  newGame.userId,
                  dataTobeUpdated
                );

                if (!updatedUser.user) {
                  resInfo = FAILED_TO_UPDATE_USER;
                }
              }

              // Don't do anything if failed to update user
              if (resInfo.resultCode !== FAILED_TO_UPDATE_USER.resultCode) {
                // CHECK IF RECORD IS ELIGIBLE FOR LEADERBOARDS
                const { id, ...tempGame } = gameQuery.game;
                const tempNewGame = {
                  gameId: id,
                  username: userQuery.user.username,
                  ...tempGame,
                };

                const leaderboardGamesQuery = await GetLeaderboardGames();

                // Fill up leaderboard first if it's less than defaultGamesToDisplayCount
                if (
                  leaderboardGamesQuery.games.length <
                  defaultGamesToDisplayCount
                ) {
                  const leaderboardGameQuery = await CreateGame(
                    tempNewGame,
                    DatabaseCollection.LEADERBOARD
                  );

                  // TODO - Must rollback gameQuery and/or updatedUser
                  if (!leaderboardGameQuery.game) {
                    resInfo = FAILED_TO_ADD_GAME_TO_LEADERBOARD;
                  }
                } else {
                  // Compare new game score to score of last ranked game in leaderboard
                  const lastRankedGameId =
                    leaderboardGamesQuery.games[defaultGamesToDisplayCount - 1]
                      .id;
                  const lastRankedGameScore =
                    leaderboardGamesQuery.games[defaultGamesToDisplayCount - 1]
                      .score;

                  // Do nothing if new game score is not greater than last ranked game score
                  if (newGame.score > lastRankedGameScore) {
                    await DeleteLeaderboardGame(lastRankedGameId);

                    const leaderboardGameQuery = await CreateGame(
                      tempNewGame,
                      DatabaseCollection.LEADERBOARD
                    );

                    // TODO - Must rollback gameQuery and/or updatedUser
                    if (!leaderboardGameQuery.game) {
                      resInfo = FAILED_TO_ADD_GAME_TO_LEADERBOARD;
                    }
                  }
                }
              }
            } else {
              resInfo = FAILED_TO_CREATE_NEW_GAME;
            }
          } else {
            resInfo = USER_NOT_FOUND;
          }
        }
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

  return res
    .status(resultCode === ApiResultStatus.SUCCESS ? 200 : 400)
    .json(resBody);
};

export default withAuth(handler);
