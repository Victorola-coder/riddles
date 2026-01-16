export type UserState = {
  username?: string;
  totalRiddlesSolved: number;
  currentStreak: number;
  lastPlayedDate: string | null;
  achievements: string[]; // Achievement IDs
  createdAt: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
};
