export const DIFFICULTY_MODIFIERS = {
  NO_HINTS: {
    id: 'NO_HINTS',
    label: 'No Hints',
    description: 'Hints are disabled',
    gemMultiplier: 1.5,
    icon: 'EyeOff',
  },
  HALF_TIMER: {
    id: 'HALF_TIMER',
    label: 'Half Timer',
    description: 'Half the normal time limit',
    gemMultiplier: 2.0,
    icon: 'Timer',
  },
  REVERSE: {
    id: 'REVERSE',
    label: 'Reverse',
    description: 'Given the answer, guess the riddle',
    gemMultiplier: 1.75,
    icon: 'RotateCcw',
  },
} as const;

export type ModifierKey = keyof typeof DIFFICULTY_MODIFIERS;
export type Modifier = (typeof DIFFICULTY_MODIFIERS)[ModifierKey];

export function getGemMultiplier(modifier: ModifierKey | null): number {
  if (!modifier) return 1;
  return DIFFICULTY_MODIFIERS[modifier]?.gemMultiplier ?? 1;
}
