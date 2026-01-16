import { Achievement } from '@/types/achievement';

export const ACHIEVEMENTS: Achievement[] = [
  // Milestone Achievements
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Solve your first riddle',
    icon: 'Footprints',
    type: 'milestone',
    requirement: 1,
    reward: 10,
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Solve 5 riddles',
    icon: 'Target',
    type: 'milestone',
    requirement: 5,
    reward: 25,
  },
  {
    id: 'riddle-enthusiast',
    name: 'Riddle Enthusiast',
    description: 'Solve 25 riddles',
    icon: 'Sparkles',
    type: 'milestone',
    requirement: 25,
    reward: 50,
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Solve 100 riddles',
    icon: 'Trophy',
    type: 'milestone',
    requirement: 100,
    reward: 200,
  },

  // Skill Achievements
  {
    id: 'no-hints-hero',
    name: 'No Hints Hero',
    description: 'Solve 10 riddles without using any hints',
    icon: 'Brain',
    type: 'skill',
    requirement: 10,
    reward: 50,
  },
  {
    id: 'perfect-streak',
    name: 'Perfect Streak',
    description: 'Solve 5 riddles in a row without any wrong answers',
    icon: 'Flame',
    type: 'skill',
    requirement: 5,
    reward: 30,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Solve a riddle in under 30 seconds',
    icon: 'Zap',
    type: 'speed',
    requirement: 1,
    reward: 25,
  },

  // Collection Achievements
  {
    id: 'gem-collector',
    name: 'Gem Collector',
    description: 'Earn 500 total gems',
    icon: 'Gem',
    type: 'collection',
    requirement: 500,
    reward: 100,
  },
  {
    id: 'gem-hoarder',
    name: 'Gem Hoarder',
    description: 'Earn 1000 total gems',
    icon: 'Coins',
    type: 'collection',
    requirement: 1000,
    reward: 250,
  },

  // Streak Achievements
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Calendar',
    type: 'streak',
    requirement: 7,
    reward: 50,
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: 'CalendarCheck',
    type: 'streak',
    requirement: 30,
    reward: 200,
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
};

export const getAchievementsByType = (type: Achievement['type']): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => achievement.type === type);
};
