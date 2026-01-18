import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '@/types/user';
import { ACHIEVEMENTS, getAchievementById } from '@/lib/constants/achievements';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { authApi } from '@/lib/api';
import { soundManager } from '@/lib/utils/sound-manager';

interface UserStore extends UserState {
  // Streak methods
  updateStreak: () => void;
  resetStreak: () => void;
  
  // Achievement methods
  checkAchievements: () => void;
  unlockAchievement: (id: string) => void;
  getUnlockedAchievements: () => typeof ACHIEVEMENTS;
  getLockedAchievements: () => typeof ACHIEVEMENTS;
  getAchievementProgress: (id: string) => number;
  
  // Tracking methods
  incrementNoHintSolves: () => void;
  incrementPerfectStreak: () => void;
  resetPerfectStreak: () => void;
  updateFastestTime: (time: number) => void;
  addGemsEarned: (gems: number) => void;
  incrementTotalSolved: () => void;
  syncWithServer: () => Promise<void>;
}

const initialState: UserState = {
  totalRiddlesSolved: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  achievements: [],
  achievementProgress: {},
  createdAt: new Date().toISOString(),
  noHintSolves: 0,
  perfectStreakCount: 0,
  fastestSolveTime: Infinity,
  totalGemsEarned: 0,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateStreak: () => {
        const today = new Date().toDateString();
        const lastPlayed = get().lastPlayedDate;

        if (!lastPlayed) {
          // First time playing
          set({
            currentStreak: 1,
            longestStreak: 1,
            lastPlayedDate: today,
          });
          return;
        }

        const lastDate = new Date(lastPlayed);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPlayed === today) {
          // Already played today
          return;
        } else if (lastDate.toDateString() === yesterday.toDateString()) {
          // Played yesterday, increment streak
          const newStreak = get().currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, get().longestStreak),
            lastPlayedDate: today,
          });

          // Give daily login bonus
          toast.success(`🔥 ${newStreak} day streak! +5 gems`, {
            duration: 3000,
          });
        } else {
          // Streak broken
          set({
            currentStreak: 1,
            lastPlayedDate: today,
          });
          toast.info('Streak reset. Start a new one today!');
        }

        // Check streak achievements
        get().checkAchievements();
      },

      resetStreak: () => {
        set({ currentStreak: 0 });
      },

      checkAchievements: () => {
        const state = get();
        const unlockedIds = state.achievements;

        ACHIEVEMENTS.forEach((achievement) => {
          // Skip if already unlocked
          if (unlockedIds.includes(achievement.id)) return;

          let currentProgress = 0;
          let shouldUnlock = false;

          switch (achievement.id) {
            // Milestone achievements
            case 'first-steps':
            case 'getting-started':
            case 'riddle-enthusiast':
            case 'century-club':
              currentProgress = state.totalRiddlesSolved;
              shouldUnlock = currentProgress >= achievement.requirement;
              break;

            // Skill achievements
            case 'no-hints-hero':
              currentProgress = state.noHintSolves;
              shouldUnlock = currentProgress >= achievement.requirement;
              break;

            case 'perfect-streak':
              currentProgress = state.perfectStreakCount;
              shouldUnlock = currentProgress >= achievement.requirement;
              break;

            case 'speed-demon':
              currentProgress = state.fastestSolveTime < 30 ? 1 : 0;
              shouldUnlock = state.fastestSolveTime <= 30;
              break;

            // Collection achievements
            case 'gem-collector':
            case 'gem-hoarder':
              currentProgress = state.totalGemsEarned;
              shouldUnlock = currentProgress >= achievement.requirement;
              break;

            // Streak achievements
            case 'week-warrior':
            case 'month-master':
              currentProgress = state.currentStreak;
              shouldUnlock = currentProgress >= achievement.requirement;
              break;
          }

          // Update progress
          set((state) => ({
            achievementProgress: {
              ...state.achievementProgress,
              [achievement.id]: currentProgress,
            },
          }));

          // Unlock if requirement met
          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
          }
        });
      },

      unlockAchievement: (id: string) => {
        const achievement = getAchievementById(id);
        if (!achievement) return;

        // Add to unlocked achievements
        set((state) => ({
          achievements: [...state.achievements, id],
          totalGemsEarned: state.totalGemsEarned + achievement.reward,
        }));

        // Show celebration
        soundManager.play('achievement');
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#fbbf24', '#10b981'],
        });

        toast.success(
          `🏆 ${achievement.name} Unlocked! ${achievement.description} (+${achievement.reward} gems)`,
          { duration: 5000 }
        );
      },


      getUnlockedAchievements: () => {
        const unlockedIds = get().achievements;
        return ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));
      },

      getLockedAchievements: () => {
        const unlockedIds = get().achievements;
        return ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id));
      },

      getAchievementProgress: (id: string) => {
        return get().achievementProgress[id] || 0;
      },

      incrementNoHintSolves: () => {
        set((state) => ({
          noHintSolves: state.noHintSolves + 1,
        }));
        get().checkAchievements();
      },

      incrementPerfectStreak: () => {
        set((state) => ({
          perfectStreakCount: state.perfectStreakCount + 1,
        }));
        get().checkAchievements();
      },

      resetPerfectStreak: () => {
        set({ perfectStreakCount: 0 });
      },

      updateFastestTime: (time: number) => {
        if (time < get().fastestSolveTime) {
          set({ fastestSolveTime: time });
          get().checkAchievements();
        }
      },

      addGemsEarned: (gems: number) => {
        set((state) => ({
          totalGemsEarned: state.totalGemsEarned + gems,
        }));
        get().checkAchievements();
      },

      incrementTotalSolved: () => {
        set((state) => ({
          totalRiddlesSolved: state.totalRiddlesSolved + 1,
        }));
        get().checkAchievements();
      },

      syncWithServer: async () => {
        try {
          const response = await authApi.getMe();
          if (response.user) {
            set((state) => ({
              totalRiddlesSolved: response.user.totalRiddlesSolved,
              totalGemsEarned: response.user.totalGems,
              currentStreak: response.user.currentStreak,
              lastPlayedDate: response.user.lastPlayedDate ? new Date(response.user.lastPlayedDate).toDateString() : null,
              achievements: response.user.achievements || [],
              // If longestStreak is returned, use it, otherwise keep local
              longestStreak: (response.user as any).longestStreak || state.longestStreak,
            }));
          }
        } catch (error) {
          console.error('Failed to sync with server:', error);
          // Silent fail - offline mode or guest
        }
      },
    }),
    {
      name: 'riddle-quest-user',
    }
  )
);
