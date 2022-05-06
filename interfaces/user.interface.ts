export interface User {
  id: string;
  email: string;
  username?: string;
  lowercaseUsername?: string;
  dateCreated: number;
  dateUpdated: number;
  updateCount: number;
  highestScoringGame: {
    gameId: string;
    round: number;
    score: number;
    wpm: number;
    words: string[];
    dateCreated: number;
  };
}
