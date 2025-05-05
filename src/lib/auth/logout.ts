
import { clearSession } from "./core";

/**
 * Logout the current user (optimized version)
 */
export const logout = async (): Promise<void> => {
  // Just clear the session - simple and fast approach
  clearSession();
  
  // Clear any cached data if needed
  if (typeof window !== 'undefined') {
    // Clear potential query cache if they exist
    const cachesToClear = ['events', 'tickets', 'notifications'];
    cachesToClear.forEach(cacheKey => {
      try {
        localStorage.removeItem(`query-cache-${cacheKey}`);
      } catch (e) {
        // Ignore errors
      }
    });
  }
};
