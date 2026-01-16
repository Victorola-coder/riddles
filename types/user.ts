export type UserState = {
  username?: string;
  totalRiddlesSolved: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  achievements: string[]; // Achievement IDs
  achievementProgress: { [key: string]: number }; // Progress towards each achievement
  createdAt: string;
  
  // Skill tracking
  noHintSolves: number; // For "No Hints Hero"
  perfectStreakCount: number; // For "Perfect Streak"
  fastestSolveTime: number; // For "Speed Demon" (in seconds)
  totalGemsEarned: number; // For "Gem Collector"
};

