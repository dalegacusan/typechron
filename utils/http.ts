import { ApiRequestFunction } from "../enums/api/api-request-function.enum";
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
