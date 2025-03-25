
import { NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Add notification for a user
 */
export const addNotification = async (
  title: string,
  message: string,
  type: NotificationType,
  userId: string
): Promise<boolean> => {
  try {
    // We're importing this from dbService in the original code
    // Moved here for completeness, assume there's a notifications table
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false,
        created_at: new Date().toISOString()
      });
    
    return true;
  } catch (error) {
    console.error("Error adding notification:", error);
    return false;
  }
};
