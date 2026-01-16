export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type Riddle = {
  id: string;
  question: string;
  answer: string | string[]; // Support multiple valid answers
  difficulty: DifficultyLevel;
  category?: string;
  hint1?: string; // First letter hint
  hint2?: string; // Word length hint
  tags?: string[];
};

export type RiddleState = 'unsolved' | 'solved' | 'skipped';
