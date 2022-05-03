export interface User {
  id: string;
  email: string;
  username?: string;
  dateCreated: number;
  highestScoringGame: {
    gameId: string;
    round: number;
    score: number;
    wpm: number;
    words: string[];
    dateCreated: number;
  };
}
