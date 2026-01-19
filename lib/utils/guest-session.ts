/**
 * Guest Session Management
 * Handles guest user identification and session persistence
 */

const GUEST_ID_STORAGE_KEY = 'riddle-quest-guest-id';

/**
 * Get or create a persistent guest ID
 * This ID persists across browser sessions using localStorage
 */
export function getGuestId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a temporary ID (will be replaced on client)
    return 'guest-temp';
  }

  let guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  
  if (!guestId) {
    // Generate a unique guest ID: guest_<timestamp>_<random>
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
  }

  return guestId;
}

/**
 * Clear guest ID (e.g., when user signs up)
 */
export function clearGuestId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_ID_STORAGE_KEY);
  }
}

/**
 * Check if a user ID is a guest ID
 */
export function isGuestId(userId: string): boolean {
  return userId.startsWith('guest_') || userId === 'guest';
}

/**
 * Migrate guest data to a real user account
 * This should be called when a guest signs up
 */
export async function migrateGuestData(
  guestId: string,
  newUserId: string
): Promise<void> {
  // This will be handled by the backend API
  // Frontend just needs to call the migration endpoint
  try {
    const response = await fetch('/api/auth/migrate-guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId, newUserId }),
    });

    if (response.ok) {
      clearGuestId();
    }
  } catch (error) {
    console.error('Failed to migrate guest data:', error);
  }
}
