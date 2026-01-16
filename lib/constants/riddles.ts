import { Riddle } from '@/types/riddle';

export const RIDDLES: Riddle[] = [
  // EASY RIDDLES (1-5)
  {
    id: 'easy-1',
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: ['echo', 'an echo'],
    difficulty: 'easy',
    hint1: 'E',
    hint2: '4 letters',
    category: 'Nature',
    tags: ['sound', 'nature'],
  },
  {
    id: 'easy-2',
    question: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?',
    answer: ['keyboard', 'a keyboard'],
    difficulty: 'easy',
    hint1: 'K',
    hint2: '8 letters',
    category: 'Technology',
    tags: ['computer', 'everyday'],
  },
  {
    id: 'easy-3',
    question: 'What gets wet while drying?',
    answer: ['towel', 'a towel'],
    difficulty: 'easy',
    hint1: 'T',
    hint2: '5 letters',
    category: 'Everyday Objects',
    tags: ['household', 'paradox'],
  },
  {
    id: 'easy-4',
    question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    answer: ['map', 'a map'],
    difficulty: 'easy',
    hint1: 'M',
    hint2: '3 letters',
    category: 'Objects',
    tags: ['geography', 'travel'],
  },
  {
    id: 'easy-5',
    question: 'What can travel around the world while staying in a corner?',
    answer: ['stamp', 'a stamp'],
    difficulty: 'easy',
    hint1: 'S',
    hint2: '5 letters',
    category: 'Objects',
    tags: ['mail', 'travel'],
  },

  // MEDIUM RIDDLES (6-10)
  {
    id: 'medium-1',
    question: 'I have branches, but no fruit, trunk, or leaves. What am I?',
    answer: ['bank', 'a bank'],
    difficulty: 'medium',
    hint1: 'B',
    hint2: '4 letters',
    category: 'Wordplay',
    tags: ['finance', 'double-meaning'],
  },
  {
    id: 'medium-2',
    question: 'The more you take, the more you leave behind. What am I?',
    answer: ['footsteps', 'steps', 'footprints'],
    difficulty: 'medium',
    hint1: 'F',
    hint2: '9 letters (or 5)',
    category: 'Abstract',
    tags: ['walking', 'paradox'],
  },
  {
    id: 'medium-3',
    question: 'What has a head and a tail but no body?',
    answer: ['coin', 'a coin'],
    difficulty: 'medium',
    hint1: 'C',
    hint2: '4 letters',
    category: 'Objects',
    tags: ['money', 'everyday'],
  },
  {
    id: 'medium-4',
    question: 'I can be cracked, made, told, and played. What am I?',
    answer: ['joke', 'a joke'],
    difficulty: 'medium',
    hint1: 'J',
    hint2: '4 letters',
    category: 'Wordplay',
    tags: ['humor', 'language'],
  },
  {
    id: 'medium-5',
    question: 'What begins with T, ends with T, and has T in it?',
    answer: ['teapot', 'a teapot'],
    difficulty: 'medium',
    hint1: 'T',
    hint2: '6 letters',
    category: 'Wordplay',
    tags: ['letters', 'objects'],
  },

  // HARD RIDDLES (11-15)
  {
    id: 'hard-1',
    question: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but water kills me. What am I?',
    answer: ['fire', 'flame'],
    difficulty: 'hard',
    hint1: 'F',
    hint2: '4 letters',
    category: 'Elements',
    tags: ['nature', 'elements', 'paradox'],
  },
  {
    id: 'hard-2',
    question: 'What is seen in the middle of March and April that can\'t be seen at the beginning or end of either month?',
    answer: ['r', 'the letter r'],
    difficulty: 'hard',
    hint1: 'R',
    hint2: '1 letter',
    category: 'Wordplay',
    tags: ['letters', 'tricky'],
  },
  {
    id: 'hard-3',
    question: 'A man pushes his car to a hotel and tells the owner he\'s bankrupt. Why?',
    answer: ['monopoly', 'playing monopoly', 'he is playing monopoly'],
    difficulty: 'hard',
    hint1: 'M',
    hint2: '8 letters',
    category: 'Lateral Thinking',
    tags: ['game', 'tricky'],
  },
  {
    id: 'hard-4',
    question: 'I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?',
    answer: ['pencil lead', 'graphite', 'lead'],
    difficulty: 'hard',
    hint1: 'P or G or L',
    hint2: '11 letters (or 8 or 4)',
    category: 'Objects',
    tags: ['writing', 'everyday'],
  },
  {
    id: 'hard-5',
    question: 'What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?',
    answer: ['river', 'a river'],
    difficulty: 'hard',
    hint1: 'R',
    hint2: '5 letters',
    category: 'Nature',
    tags: ['water', 'nature', 'poetic'],
  },
];

// Helper functions
export const getRiddleById = (id: string): Riddle | undefined => {
  return RIDDLES.find((riddle) => riddle.id === id);
};

export const getRiddlesByDifficulty = (difficulty: Riddle['difficulty']): Riddle[] => {
  return RIDDLES.filter((riddle) => riddle.difficulty === difficulty);
};

export const getNextRiddle = (currentId: string | null, solvedIds: string[]): Riddle | null => {
  if (!currentId) {
    // Return first unsolved riddle
    return RIDDLES.find((r) => !solvedIds.includes(r.id)) || null;
  }

  const currentIndex = RIDDLES.findIndex((r) => r.id === currentId);
  // Find next unsolved riddle
  for (let i = currentIndex + 1; i < RIDDLES.length; i++) {
    if (!solvedIds.includes(RIDDLES[i].id)) {
      return RIDDLES[i];
    }
  }

  // If no more unsolved riddles, return null
  return null;
};
