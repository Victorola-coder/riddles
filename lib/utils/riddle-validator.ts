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

/**
 * Validates answer in REVERSE mode (user guesses the riddle question)
 * More lenient - checks if user's answer contains key words from the question
 */
export const validateReverseAnswer = (userAnswer: string, riddle: Riddle): boolean => {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedQuestion = riddle.question.toLowerCase();
  
  // Remove common question words for better matching
  const removeCommonWords = (text: string) => {
    const commonWords = ['what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'by', 'about', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'has', 'have', 'had', 'do', 'does', 'did', 'but', 'or', 'and', 'if', 'because', 'while', 'this', 'that', 'these', 'those'];
    return text.split(/\s+/).filter(word => !commonWords.includes(word)).join(' ');
  };
  
  const cleanedUserAnswer = removeCommonWords(normalizedUserAnswer);
  const cleanedQuestion = removeCommonWords(normalizedQuestion);
  
  // Extract key words (words longer than 3 characters)
  const getKeyWords = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 3);
  };
  
  const userKeyWords = getKeyWords(cleanedUserAnswer);
  const questionKeyWords = getKeyWords(cleanedQuestion);
  
  // If no key words, fall back to simple contains check
  if (questionKeyWords.length === 0) {
    return normalizedUserAnswer.includes(normalizedQuestion) || normalizedQuestion.includes(normalizedUserAnswer);
  }
  
  // Count how many key words from the question are in the user's answer
  const matchedWords = questionKeyWords.filter(word => 
    cleanedUserAnswer.includes(word)
  );
  
  // Consider it correct if at least 60% of key words match
  const matchPercentage = matchedWords.length / questionKeyWords.length;
  return matchPercentage >= 0.6;
};
