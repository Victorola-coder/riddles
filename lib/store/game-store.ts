import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, HintLevel } from '@/types/game';
import { GAME_CONFIG } from '@/lib/constants/game-config';
import { getNextRiddle, RIDDLES } from '@/lib/constants/riddles';

interface GameStore extends GameState {
  // Actions
  solveRiddle: (riddleId: string, gemsEarned: number) => void;
  skipRiddle: (riddleId: string) => void;
  useHint: (riddleId: string, hintLevel: HintLevel) => void;
  nextRiddle: () => void;
  resetGame: () => void;
  spendGems: (amount: number) => boolean; // Returns true if successful
  earnGems: (amount: number) => void;
  hasEnoughGems: (amount: number) => boolean;
  hasUsedHint: (riddleId: string, hintLevel: HintLevel) => boolean;
}

const initialState: GameState = {
  currentRiddleId: RIDDLES[0]?.id || null,
  solvedRiddles: [],
  skippedRiddles: [],
  userGems: GAME_CONFIG.INITIAL_GEMS,
  currentLevel: GAME_CONFIG.INITIAL_LEVEL,
  hintsUsed: {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      solveRiddle: (riddleId, gemsEarned) => {
        set((state) => ({
          solvedRiddles: [...state.solvedRiddles, riddleId],
          userGems: state.userGems + gemsEarned,
        }));
      },

      skipRiddle: (riddleId) => {
        const cost = GAME_CONFIG.GEM_COSTS.skip;
        if (get().hasEnoughGems(cost)) {
          set((state) => ({
            skippedRiddles: [...state.skippedRiddles, riddleId],
            userGems: state.userGems - cost,
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
          }));
        }
      },

      nextRiddle: () => {
        const currentId = get().currentRiddleId;
        const solvedIds = get().solvedRiddles;
        const nextRiddle = getNextRiddle(currentId, solvedIds);

        set({
          currentRiddleId: nextRiddle?.id || null,
        });
      },

      resetGame: () => {
        set(initialState);
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
    }
  )
);
