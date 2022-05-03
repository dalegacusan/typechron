import { User } from "./user.interface";

export interface Game {
  id?: string;
  userId: string;
  user?: User; // For leaderboards
  round: number;
  score: number;
  wpm: number;
  words: string[];
  // Store as unix timestamp
  dateCreated: number;
}
