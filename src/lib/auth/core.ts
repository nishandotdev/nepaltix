
import { User, UserRole } from "@/types";

// Storage key for auth session
const AUTH_STORAGE_KEY = 'nepal_ticketing_auth';

/**
 * Get the current auth session from local storage
 */
export const getStoredSession = (): { user: Omit<User, 'password'> | null; isAuthenticated: boolean } => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    
    if (!authData) {
      return { user: null, isAuthenticated: false };
    }
    
    return JSON.parse(authData);
  } catch (error) {
    console.error("Error parsing stored session:", error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, isAuthenticated: false };
  }
};

/**
 * Save user to session storage
 */
export const saveToSession = (user: Omit<User, 'password'>): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user: user,
      isAuthenticated: true
    }));
    console.log("User session saved successfully:", user.name);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

/**
 * Clear auth session
 */
export const clearSession = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log("User session cleared successfully");
  } catch (error) {
    console.error("Error clearing session:", error);
  }
};

/**
 * Initialize auth state from stored session
 */
export const initAuthState = async (): Promise<void> => {
  // Just check local storage - no Supabase
  const localSession = getStoredSession();
  if (localSession.isAuthenticated && localSession.user) {
    console.log("Using existing local session for:", localSession.user.email);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getStoredSession().isAuthenticated;
};

/**
 * Check if user is an admin
 */
export const isAdmin = (): boolean => {
  const { user } = getStoredSession();
  return user?.role === UserRole.ADMIN || user?.id === 'demo-admin-id';
};
