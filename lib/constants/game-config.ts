import { DifficultyLevel } from '@/types/riddle';

export const GAME_CONFIG = {
  // Gem rewards for solving riddles
  GEM_REWARDS: {
    easy: 10,
    medium: 20,
    hard: 50,
  } as Record<DifficultyLevel, number>,

  // Gem costs for actions
  GEM_COSTS: {
    hint1: 15, // First letter
    hint2: 10, // Word length
    hint3: 50, // Full answer
    skip: 30,
    timeout: 25, // Penalty for running out of time
  },

  // Bonus gems
  BONUSES: {
    firstTime: 100,
    dailyLogin: 5,
    perfectLevel: 25, // Complete level without hints
  },

  // Level progression
  LEVELS: {
    easyRange: [1, 10],
    mediumRange: [11, 25],
    hardRange: [26, 100],
    unlockThreshold: 0.7, // 70% completion to unlock next tier
  },

  // Starting values
  // Timer Settings (in seconds)
  TIMER: {
    easy: 0, // Infinite
    medium: 120,
    hard: 60,
    levelDecrement: 2, // Decrease by 2s per level (optional advanced mode)
    minTime: 30, // Minimum time floor
  },

  INITIAL_GEMS: 50,
  INITIAL_LEVEL: 1,
} as const;
