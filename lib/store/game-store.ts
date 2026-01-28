import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, HintLevel } from '@/types/game';
import { GAME_CONFIG } from '@/lib/constants/game-config';

interface GameStore extends GameState {
  // Timer State
  timeLeft: number;
  totalTime: number; // Duration for current riddle
  isTimerActive: boolean;

  // Actions
  solveRiddle: (riddleId: string, gemsEarned: number) => void;
  skipRiddle: (riddleId: string) => void;
  useHint: (riddleId: string, hintLevel: HintLevel) => void;
  resetGame: () => void;
  spendGems: (amount: number) => boolean;
  earnGems: (amount: number) => void;
  hasEnoughGems: (amount: number) => boolean;
  hasUsedHint: (riddleId: string, hintLevel: HintLevel) => boolean;
  
  // Timer Actions
  tickTimer: () => void;
  stopTimer: () => void;
}

const initialState: GameState = {
  currentRiddleId: null,
  solvedRiddles: [],
  skippedRiddles: [],
  userGems: GAME_CONFIG.INITIAL_GEMS,
  currentLevel: GAME_CONFIG.INITIAL_LEVEL,
  hintsUsed: {},
  activeModifier: null,
};

const getLevelDuration = (level: number, difficulty: string): number => {
  if (difficulty === 'easy') return GAME_CONFIG.TIMER.easy;
  
  const baseTime = difficulty === 'hard' ? GAME_CONFIG.TIMER.hard : GAME_CONFIG.TIMER.medium;
  const decrement = (level - 1) * GAME_CONFIG.TIMER.levelDecrement;
  
  return Math.max(baseTime - decrement, GAME_CONFIG.TIMER.minTime);
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      timeLeft: 0,
      totalTime: 0,
      isTimerActive: false,

      solveRiddle: (riddleId, gemsEarned) => {
        set((state) => ({
          solvedRiddles: [...state.solvedRiddles, riddleId],
          userGems: state.userGems + gemsEarned,
          isTimerActive: false, // Stop timer on solve
        }));
      },

      skipRiddle: (riddleId) => {
        const cost = GAME_CONFIG.GEM_COSTS.skip;
        if (get().hasEnoughGems(cost)) {
          set((state) => ({
            skippedRiddles: [...state.skippedRiddles, riddleId],
            userGems: state.userGems - cost,
            isTimerActive: false,
          }));
        }
      },

      useHint: (riddleId, hintLevel) => {
        const costKey = `hint${hintLevel}` as keyof typeof GAME_CONFIG.GEM_COSTS;
        const cost = GAME_CONFIG.GEM_COSTS[costKey];

        if (get().hasEnoughGems(cost) && !get().hasUsedHint(riddleId, hintLevel)) {
          set((state) => ({
            userGems: state.userGems - cost,
            hintsUsed: {
              ...state.hintsUsed,
              [riddleId]: [...(state.hintsUsed[riddleId] || []), hintLevel],
            },
            // Penalty: Reduce time by 10s for using a hint? (Optional)
          }));
        }
      },


      tickTimer: () => {
        const { timeLeft, isTimerActive } = get();
        if (isTimerActive && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (isTimerActive && timeLeft <= 0) {
          set({ isTimerActive: false }); // Time's up!
          // Handle Game Over or Timeout Logic here
          // For now, simpler to just stop. The UI will show 0.
        }
      },

      stopTimer: () => {
        set({ isTimerActive: false });
      },

      resetGame: () => {
        set({
          ...initialState,
          timeLeft: 0,
          totalTime: 0,
          isTimerActive: false,
        });
      },

      spendGems: (amount) => {
        if (get().hasEnoughGems(amount)) {
          set((state) => ({
            userGems: state.userGems - amount,
          }));
          return true;
        }
        return false;
      },

      earnGems: (amount) => {
        set((state) => ({
          userGems: state.userGems + amount,
        }));
      },

      hasEnoughGems: (amount) => {
        return get().userGems >= amount;
      },

      hasUsedHint: (riddleId, hintLevel) => {
        const hints = get().hintsUsed[riddleId] || [];
        return hints.includes(hintLevel);
      },
    }),
    {
      name: 'riddle-quest-game',
      partialize: (state) => ({
        currentRiddleId: state.currentRiddleId,
        solvedRiddles: state.solvedRiddles,
        skippedRiddles: state.skippedRiddles,
        userGems: state.userGems,
        currentLevel: state.currentLevel,
        hintsUsed: state.hintsUsed,
        // Timer state is ephemeral — persisting it causes stale values on return
      }),
    }
  )
);

