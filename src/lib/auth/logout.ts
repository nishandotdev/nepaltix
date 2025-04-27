
import { supabase } from "@/integrations/supabase/client";
import { addNotification } from "./notifications";
import { NotificationType } from "@/types";
import { getStoredSession } from "./core";

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  const { user } = getStoredSession();
  
  if (user) {
    // Create logout notification
    await addNotification(
      'Logged Out',
      'You have been successfully logged out.',
      NotificationType.INFO,
      user.id
    );
  }
  
  await supabase.auth.signOut();
};
