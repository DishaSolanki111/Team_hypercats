export interface RateLimitStatus {
  isAllowed: boolean;
  remainingRequests: number;
  resetTimeMs: number;
  retryAfterSeconds?: number;
}

export class SlidingWindowRateLimiter {
  private windowSizeMs: number;
  private maxRequests: number;
  private requestTimestamps: number[] = [];

  constructor(maxRequests: number = 30, windowSizeSeconds: number = 60) {
    this.maxRequests = maxRequests;
    this.windowSizeMs = windowSizeSeconds * 1000;
  }

  check(): RateLimitStatus {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    // Filter out timestamps older than current window
    this.requestTimestamps = this.requestTimestamps.filter(t => t > windowStart);

    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldest = this.requestTimestamps[0];
      const resetTimeMs = oldest + this.windowSizeMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));

      return {
        isAllowed: false,
        remainingRequests: 0,
        resetTimeMs,
        retryAfterSeconds
      };
    }

    // Record request
    this.requestTimestamps.push(now);

    return {
      isAllowed: true,
      remainingRequests: this.maxRequests - this.requestTimestamps.length,
      resetTimeMs: now + this.windowSizeMs
    };
  }

  reset(): void {
    this.requestTimestamps = [];
  }
}

export const globalRateLimiter = new SlidingWindowRateLimiter(40, 60);
