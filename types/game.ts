export type GameState = {
  currentRiddleId: string | null;
  solvedRiddles: string[]; // Array of solved riddle IDs
  skippedRiddles: string[];
  userGems: number;
  currentLevel: number;
  hintsUsed: {
    [riddleId: string]: number[]; // Which hints used per riddle (1, 2, 3)
  };
};

export type HintLevel = 1 | 2 | 3;

export type GameAction = 
  | { type: 'SOLVE_RIDDLE'; riddleId: string; gemsEarned: number }
  | { type: 'SKIP_RIDDLE'; riddleId: string; gemsSpent: number }
  | { type: 'USE_HINT'; riddleId: string; hintLevel: HintLevel; gemsSpent: number }
  | { type: 'NEXT_RIDDLE'; riddleId: string }
  | { type: 'RESET_GAME' };
