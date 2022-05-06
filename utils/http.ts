import { ApiRequestFunction } from "./api/enums/api-request-function.enum";
import { QueryOrderDirection } from "./api/enums/query-order-direction.enum";
import { APIGamesResponse } from "../interfaces/api/games.interface";
import { APIUsersResponse } from "../interfaces/api/users.interface";
import { ToBase64 } from "./base64";

export const QUERY_USER = async (userIdToken: string, userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
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
        signature: ToBase64(userIdToken),
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
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
          username,
        },
        signature: ToBase64(userIdToken),
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
    method: "PUT",
    headers: {
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
        signature: ToBase64(userIdToken),
      },
    }),
  });
  const data: APIUsersResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
  };
};

export const QUERY_GAMES = async (
  userIdToken: string,
  limit: number,
  orderBy: {
    direction: QueryOrderDirection;
    fieldPath: string;
  },
  userId: string,
  lastKey?: number
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/games`, {
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
        signature: ToBase64(userIdToken),
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

export const QUERY_GAMES_LEADERBOARD = async (
  limit: number,
  orderBy: {
    direction: QueryOrderDirection;
    fieldPath: string;
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: {
        head: {
          function: ApiRequestFunction.GAME_QUERY_LEADERBOARDS,
        },
        body: {
          limit,
          orderBy,
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/games`, {
    method: "POST",
    headers: {
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
        signature: ToBase64(userIdToken),
      },
    }),
  });
  const data: APIGamesResponse = await res.json();

  return {
    resultInfo: data.response.body.resultInfo,
    game: data.response.body.game,
  };
};
