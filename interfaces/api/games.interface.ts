import { ApiRequestFunction } from "../../utils/api/enums/api-request-function.enum";
import { DocumentData } from "firebase/firestore";
import { QueryOrderDirection } from "../../utils/api/enums/query-order-direction.enum";
import { ApiResultInfo } from "./api-result-info.interface";

export interface APIGamesRequest {
  request: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      limit: number;
      orderBy: {
        direction: QueryOrderDirection;
        fieldPath: string;
      };
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
}

export interface APIGamesResponse {
  response: {
    head: {
      function: ApiRequestFunction;
    };
    body: {
      resultInfo: ApiResultInfo;
      game?: DocumentData; // Type Game
      games?: DocumentData[]; // Type Game
      lastKey?: number;
    };
  };
}
