/**
 * In-memory sliding window rate limiter
 * Allows 10 requests per hour per IP address.
 * Structured cleanly to swap out with Upstash Redis or distributed storage in production.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  resetTime: number;
}

class SlidingWindowRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 10, windowMs = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Periodic cleanup of stale records every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  public check(ip: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.store.get(ip);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(ip, record);
    }

    // Filter out timestamps older than the sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0];
      const resetTime = oldest + this.windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
        resetTime,
      };
    }

    // Add current timestamp
    record.timestamps.push(now);

    const remaining = this.maxRequests - record.timestamps.length;
    const oldestInWindow = record.timestamps[0];
    const resetTime = oldestInWindow + this.windowMs;

    return {
      allowed: true,
      remaining,
      resetTime,
    };
  }

  private cleanup(): void {
    const windowStart = Date.now() - this.windowMs;
    for (const [ip, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.store.delete(ip);
      }
    }
  }
}

export const rateLimiter = new SlidingWindowRateLimiter(60, 60 * 60 * 1000);
