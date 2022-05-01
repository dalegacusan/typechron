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
}
