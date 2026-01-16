export type AchievementType = 'milestone' | 'streak' | 'speed' | 'skill' | 'collection';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  type: AchievementType;
  requirement: number; // e.g., 10 for "solve 10 riddles"
  reward: number; // Bonus gems
  unlockedAt?: string; // ISO date
  progress?: number; // Current progress towards requirement
};

export type AchievementProgress = {
  [achievementId: string]: number;
};
