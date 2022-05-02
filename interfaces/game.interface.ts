export interface Game {
  id?: string;
  user: {
    id: string;
    username: string;
  };
  round: number;
  points: number;
  wpm: number;
  words: string[];
  // Store as unix timestamp
  // Optional because server should be the one creating timestamp
  dateCreated?: number;
}
