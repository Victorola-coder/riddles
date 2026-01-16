/**
 * Analytics utility for tracking user interactions
 * Placeholder for future analytics integration (Google Analytics, PostHog, etc.)
 */

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

/**
 * Track an analytics event
 * @param event - Event name and properties
 */
export function trackEvent(event: AnalyticsEvent): void {
  // Placeholder for analytics integration
  // Example implementations:
  // - Google Analytics: gtag('event', event.name, event.properties)
  // - PostHog: posthog.capture(event.name, event.properties)
  // - Vercel Analytics: track(event.name, event.properties)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  trackEvent({
    name: 'page_view',
    properties: { path },
  });
}

/**
 * Track riddle solved
 */
export function trackRiddleSolved(riddleId: string, difficulty: string, timeSpent?: number): void {
  trackEvent({
    name: 'riddle_solved',
    properties: {
      riddleId,
      difficulty,
      timeSpent,
    },
  });
}

/**
 * Track hint used
 */
export function trackHintUsed(riddleId: string, hintLevel: 1 | 2 | 3): void {
  trackEvent({
    name: 'hint_used',
    properties: {
      riddleId,
      hintLevel,
    },
  });
}

/**
 * Track gem earned
 */
export function trackGemEarned(amount: number, source: string): void {
  trackEvent({
    name: 'gem_earned',
    properties: {
      amount,
      source,
    },
  });
}

/**
 * Track gem spent
 */
export function trackGemSpent(amount: number, reason: string): void {
  trackEvent({
    name: 'gem_spent',
    properties: {
      amount,
      reason,
    },
  });
}

/**
 * Track level progression
 */
export function trackLevelProgress(level: number, difficulty: string): void {
  trackEvent({
    name: 'level_progress',
    properties: {
      level,
      difficulty,
    },
  });
}
