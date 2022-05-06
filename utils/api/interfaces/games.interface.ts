import { ApiRequestFunction } from "../../utils/api/enums/api-request-function.enum";
import { DocumentData } from "firebase/firestore";
import { ApiResultInfo } from "./api-result-info.interface";

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
