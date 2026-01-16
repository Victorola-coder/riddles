import { Riddle } from '@/types/riddle';

/**
 * Validates if the user's answer matches the riddle's correct answer(s)
 * Case-insensitive and trims whitespace
 */
export const validateAnswer = (userAnswer: string, riddle: Riddle): boolean => {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();

  if (Array.isArray(riddle.answer)) {
    return riddle.answer.some(
      (answer) => answer.toLowerCase() === normalizedUserAnswer
    );
  }

  return riddle.answer.toLowerCase() === normalizedUserAnswer;
};

/**
 * Gets the first letter hint for a riddle
 */
export const getFirstLetterHint = (riddle: Riddle): string => {
  if (riddle.hint1) return riddle.hint1;

  const answer = Array.isArray(riddle.answer) ? riddle.answer[0] : riddle.answer;
  return answer.charAt(0).toUpperCase();
};

/**
 * Gets the word length hint for a riddle
 */
export const getWordLengthHint = (riddle: Riddle): string => {
  if (riddle.hint2) return riddle.hint2;

  const answer = Array.isArray(riddle.answer) ? riddle.answer[0] : riddle.answer;
  const length = answer.replace(/\s/g, '').length; // Remove spaces for counting
  return `${length} letter${length !== 1 ? 's' : ''}`;
};

/**
 * Gets the full answer (for reveal)
 */
export const getFullAnswer = (riddle: Riddle): string => {
  return Array.isArray(riddle.answer) ? riddle.answer[0] : riddle.answer;
};
