/**
 * Weighted random selection for mystery box rewards
 * Higher weight = higher probability of selection
 */

export interface WeightedItem {
  id: string;
  weight: number;
}

/**
 * Select a random item based on weights
 * @param items Array of items with weights
 * @returns Selected item or null if no items
 */
export function selectWeightedRandom<T extends WeightedItem>(items: T[]): T | null {
  if (!items || items.length === 0) return null;

  // Filter out items with weight <= 0
  const validItems = items.filter((item) => item.weight > 0);
  if (validItems.length === 0) return null;

  // Calculate total weight
  const totalWeight = validItems.reduce((sum, item) => sum + item.weight, 0);

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Select item based on cumulative weight
  for (const item of validItems) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback to last item (shouldn't happen, but just in case)
  return validItems[validItems.length - 1];
}

/**
 * Calculate probability of getting each item
 * @param items Array of items with weights
 * @returns Map of item ID to probability percentage
 */
export function calculateProbabilities<T extends WeightedItem>(
  items: T[]
): Map<string, number> {
  const probabilities = new Map<string, number>();

  const validItems = items.filter((item) => item.weight > 0);
  if (validItems.length === 0) return probabilities;

  const totalWeight = validItems.reduce((sum, item) => sum + item.weight, 0);

  for (const item of validItems) {
    const probability = (item.weight / totalWeight) * 100;
    probabilities.set(item.id, probability);
  }

  return probabilities;
}

/**
 * Get rarity tier based on probability
 * @param probability Percentage (0-100)
 * @returns Rarity tier
 */
export function getRarityFromProbability(probability: number): string {
  if (probability >= 50) return "COMMON";
  if (probability >= 25) return "RARE";
  if (probability >= 10) return "EPIC";
  return "LEGENDARY";
}
