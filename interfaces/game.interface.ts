export interface Game {
  id?: string;
  userId: string;
  round: number;
  score: number;
  wpm: number;
  words: string[];
  // Store as unix timestamp
  dateCreated: number;
}
