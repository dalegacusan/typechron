import { ApiRequestFunction } from "../enums/api-request-function.enum";
import { ApiResultInfo } from "./api-result-info.interface";
import { DocumentData } from "firebase/firestore";

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
