/**
 * API Module Exports
 * Centralized export for all API functions
 */

export * from "./client";
export { adminApi } from "./admin";
export { gameApi } from "./game";
export { authApi } from "./auth";
export { riddlesApi } from "./riddles";
export { leaderboardApi } from "./leaderboard";
export type { Riddle, RiddlesResponse } from "./riddles";
