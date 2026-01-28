/**
 * Format milliseconds to human-readable time string
 * Examples: "1.5s", "45s", "2m 30s", "1h 15m"
 */
export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  // Show decimal for sub-second precision if under 10 seconds
  if (seconds < 10) {
    return `${(ms / 1000).toFixed(1)}s`;
  }

  return `${seconds}s`;
}
