
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
 * Initialize auth state from Supabase session
 */
export const initAuthState = async (): Promise<void> => {
  try {
    // Check for existing local session first
    const localSession = getStoredSession();
    if (localSession.isAuthenticated && localSession.user) {
      console.log("Using existing local session for:", localSession.user.email);
      return;
    }
    
    // Otherwise check Supabase session
    const { data } = await supabase.auth.getSession();
    
    if (data && data.session) {
      console.log("Found Supabase session, fetching profile");
      // Fetch profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
          
      if (profileData && !error) {
        console.log("Profile found, saving session");
        saveToSession({
          id: data.session.user.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as UserRole,
          createdAt: profileData.created_at
        });
      } else {
        console.log("Profile not found or error:", error);
        
        // If profile doesn't exist but we have a session, create a profile
        if (data.session.user.email) {
          console.log("Creating missing profile for authenticated user");
          
          // Try to create profile
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.session.user.id,
              name: data.session.user.email.split('@')[0] || 'User',
              email: data.session.user.email,
              role: UserRole.USER,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (newProfile && !insertError) {
            saveToSession({
              id: data.session.user.id,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role as UserRole,
              createdAt: newProfile.created_at
            });
            console.log("Created and saved new profile");
          }
        }
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
  return user?.role === UserRole.ADMIN || user?.id === 'demo-admin-id';
};
