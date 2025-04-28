
import { clearSession } from "./core";

/**
 * Logout the current user (simplified version)
 */
export const logout = async (): Promise<void> => {
  // Just clear the session
  clearSession();
};
