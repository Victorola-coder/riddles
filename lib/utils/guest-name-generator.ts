/**
 * Guest Name Generator
 * Generates random, unique names for guest users
 */

// Adjective + Noun combinations for variety
const ADJECTIVES = [
  'Adventurous', 'Clever', 'Swift', 'Bold', 'Wise', 'Brave', 'Curious', 'Eager',
  'Fierce', 'Gentle', 'Happy', 'Jolly', 'Kind', 'Lucky', 'Mighty', 'Noble',
  'Quick', 'Radiant', 'Smart', 'Tough', 'Vivid', 'Witty', 'Zealous', 'Bright',
  'Calm', 'Daring', 'Epic', 'Fancy', 'Glorious', 'Heroic', 'Incredible', 'Joyful',
  'Keen', 'Lively', 'Majestic', 'Nimble', 'Optimistic', 'Proud', 'Quiet', 'Rapid',
  'Smooth', 'Triumphant', 'Unique', 'Vibrant', 'Wondrous', 'Xtra', 'Youthful', 'Zesty'
];

const NOUNS = [
  'Panda', 'Fox', 'Eagle', 'Lion', 'Tiger', 'Wolf', 'Bear', 'Dragon',
  'Phoenix', 'Falcon', 'Hawk', 'Raven', 'Owl', 'Shark', 'Dolphin', 'Whale',
  'Elephant', 'Rhino', 'Cheetah', 'Jaguar', 'Panther', 'Leopard', 'Lynx', 'Cougar',
  'Stallion', 'Mustang', 'Stallion', 'Warrior', 'Knight', 'Guardian', 'Champion', 'Hero',
  'Explorer', 'Voyager', 'Pioneer', 'Trailblazer', 'Seeker', 'Wanderer', 'Traveler', 'Adventurer',
  'Sage', 'Wizard', 'Mage', 'Sorcerer', 'Enchanter', 'Alchemist', 'Scholar', 'Scientist'
];

/**
 * Generate a random guest name
 * Format: Adjective + Noun + RandomNumber (e.g., "AdventurousPanda42")
 */
export function generateGuestName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randomNum = Math.floor(Math.random() * 9999); // 0-9999 for uniqueness
  
  return `${adjective}${noun}${randomNum}`;
}

/**
 * Generate a unique guest name by checking against existing usernames
 * Falls back to a simple unique name if database check fails
 */
export async function generateUniqueGuestName(
  checkUnique?: (username: string) => Promise<boolean>
): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const name = generateGuestName();
    
    // If no uniqueness check provided, return the generated name
    if (!checkUnique) {
      return name;
    }
    
    // Check if name is unique
    const isUnique = await checkUnique(name);
    if (isUnique) {
      return name;
    }
    
    attempts++;
  }
  
  // Fallback: use timestamp-based name if all attempts fail
  return `Guest${Date.now()}`;
}
