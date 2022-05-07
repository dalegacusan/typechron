import { User } from "./user.interface";

export interface Game {
  id?: string;
  gameId?: string; // For leaderboard
  userId: string;
  user?: User; // For leaderboard
  username?: string;
  round: number;
  score: number;
  wpm: number;
  words: string[];
  // Store as unix timestamp
  dateCreated: number;
}
