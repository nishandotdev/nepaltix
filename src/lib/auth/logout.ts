
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";
import { NotificationType } from "@/types";
import { getStoredSession, clearSession } from "./core";

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  const { user } = getStoredSession();
  
  if (user) {
    try {
      // Skip notification for demo users
      if (!user.id.startsWith('demo-')) {
        // Create logout notification
        await addNotification(
          'Logged Out',
          'You have been successfully logged out.',
          NotificationType.INFO,
          user.id
        ).catch(err => console.error("Error creating logout notification:", err));
      }
    } catch (error) {
      console.error("Error creating logout notification:", error);
    }
  }
  
  // Clear session first to prevent race conditions
  clearSession();
  
  // Then sign out from Supabase
  await supabase.auth.signOut().catch(err => {
    console.error("Error signing out from Supabase:", err);
  });
};
