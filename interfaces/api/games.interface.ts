import { ApiRequestFunction } from "../../enums/api/api-request-function.enum";
import { Game } from "../game.interface";
import { DocumentData } from "firebase/firestore";
import { ApiResultStatus } from "../../enums/api/api-result-status.enum";
import { ApiResultCode } from "../../enums/api/api-result-code.enum";
import { QueryOrderBy } from "../../enums/api/query-order-by.enum";

export interface APIGamesRequest {
  request: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      limit: number;
      orderBy: QueryOrderBy;
      lastKey?: number;
      // For creating a new game record
      userId?: string;
      round?: number;
      score?: number;
      wpm?: number;
      words?: string[];
      dateCreated?: number;
    };
  };
  signature: string;
}

export interface APIGamesResponse {
  response: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      resultInfo: {
        resultStatus: ApiResultStatus;
        resultCode: ApiResultCode;
        resultMsg: string;
      };
      game?: Game;
      games?: DocumentData[]; // Type Game
      lastKey?: number;
    };
  };
}
