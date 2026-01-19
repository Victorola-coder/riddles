/**
 * Simple in-memory rate limiter
 * Note: In a distributed environment (serverless), this state is local to the container.
 * For strict global rate limiting, use Redis (e.g., @upstash/ratelimit).
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private interval: number; // in milliseconds
  private limit: number;

  constructor(limit: number, intervalMs: number) {
    this.limit = limit;
    this.interval = intervalMs;
  }

  public check(identifier: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or expired window
      const newRecord = {
        count: 1,
        resetTime: now + this.interval,
      };
      this.store.set(identifier, newRecord);
      
      // Cleanup old entries periodically if needed (omitted for simplicity in this minimal implementation)
      
      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: newRecord.resetTime,
      };
    }

    if (record.count >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: record.resetTime,
      };
    }

    record.count += 1;
    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - record.count,
      reset: record.resetTime,
    };
  }
}

// 5 attempts per minute per IP for sensitive auth routes
export const authLimiter = new RateLimiter(5, 60 * 1000);

// 3 signups per hour per IP to prevent spam registration
export const signupLimiter = new RateLimiter(3, 60 * 60 * 1000);

// 20 actions per minute for game interactions (spam click protection)
export const gameLimiter = new RateLimiter(20, 60 * 1000);
