
import { User, UserRole, NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Storage key for auth session
const AUTH_STORAGE_KEY = 'nepal_ticketing_auth';

/**
 * Get the current auth session from local storage
 */
export const getStoredSession = (): { user: Omit<User, 'password'> | null; isAuthenticated: boolean } => {
  const authData = localStorage.getItem(AUTH_STORAGE_KEY);
  
  if (!authData) {
    return { user: null, isAuthenticated: false };
  }
  
  return JSON.parse(authData);
};

/**
 * Save user to session storage
 */
export const saveToSession = (user: Omit<User, 'password'>): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    user: user,
    isAuthenticated: true
  }));
};

/**
 * Clear auth session
 */
export const clearSession = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Initialize auth state from Supabase session
 */
export const initAuthState = async (): Promise<void> => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // Fetch profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
          
      if (profileData && !error) {
        saveToSession({
          id: data.session.user.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as UserRole,
          createdAt: profileData.created_at
        });
      }
    }
  } catch (error) {
    console.error("Failed to initialize auth state:", error);
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
  return user?.role === UserRole.ADMIN;
};
