import { ApiRequestFunction } from "../enums/api/api-request-function.enum";
import { QueryOrderDirection } from "../enums/api/query-order-direction.enum";
import { APIGamesResponse } from "../interfaces/api/games.interface";
import { APIUsersResponse } from "../interfaces/api/users.interface";

export const QUERY_USER = async (userId: string) => {
  const res = await fetch(`http://localhost:3000/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.USER_QUERY,
        },
        body: {
          userId,
        },
      },
    }),
  });
  const data: APIUsersResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    user: data.response.body.user,
  };
};

export const CREATE_USER = async (userId: string, email: string) => {
  const res = await fetch(`http://localhost:3000/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.USER_CREATE,
        },
        body: {
          userId,
          email,
        },
      },
    }),
  });
  const data: APIUsersResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    user: data.response.body.user,
  };
};

export const QUERY_GAMES = async (
  limit: number,
  orderBy: {
    direction: QueryOrderDirection;
    fieldPath: string;
  },
  userId?: string,
  lastKey?: number
) => {
  const res = await fetch(`http://localhost:3000/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.GAME_QUERY,
        },
        body: {
          limit,
          orderBy,
          userId,
          lastKey,
        },
      },
    }),
  });
  const data: APIGamesResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    games: data.response.body.games,
    lastKey: data.response.body.lastKey,
  };
};
