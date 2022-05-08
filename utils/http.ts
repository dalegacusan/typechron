import { ApiRequestFunction } from "./api/enums/api-request-function.enum";
import { QueryOrderDirection } from "./api/enums/query-order-direction.enum";
import { APIGamesResponse } from "./api/interfaces/games.interface";
import { APIUsersResponse } from "./api/interfaces/users.interface";
import { ToBase64 } from "./base64";

export const QUERY_USER = async (userIdToken: string, userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ToBase64(userIdToken)}`,
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

export const CREATE_USER = async (
  userIdToken: string,
  userId: string,
  email: string,
  username?: string
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ToBase64(userIdToken)}`,
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
          username,
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

export const UPDATE_USER = async (
  userIdToken: string,
  userId: string,
  username: string
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ToBase64(userIdToken)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.USER_UPDATE,
        },
        body: {
          userId,
          username,
        },
      },
    }),
  });
  const data: APIUsersResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
  };
};

export const QUERY_GAMES_USER = async (
  userIdToken: string,
  limit: number,
  orderBy: {
    direction: QueryOrderDirection;
    fieldPath: string;
  },
  userId: string,
  lastKey?: number
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/games`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ToBase64(userIdToken)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.GAME_QUERY_USER,
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

export const QUERY_GAMES_LEADERBOARD = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.GAME_QUERY_LEADERBOARD,
        },
      },
    }),
  });
  const data: APIGamesResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    games: data.response.body.games,
  };
};

export const CREATE_GAME = async (
  userIdToken: string,
  userId: string,
  round: number,
  score: number,
  wpm: number,
  words: string[]
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/games`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ToBase64(userIdToken)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.GAME_CREATE,
        },
        body: {
          userId,
          round,
          score,
          wpm,
          words,
        },
      },
    }),
  });
  const data: APIGamesResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    game: data.response.body.game,
  };
};
