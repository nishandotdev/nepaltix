
import { NotificationType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    
    // Show a toast notification for immediate feedback
    toast.success(`New notification: ${title}`);
    
    return true;
  } catch (error) {
    console.error("Error adding notification:", error);
    toast.error("Failed to create notification");
    return false;
  }
};

/**
 * Get all public notifications
 */
export const getAllNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .is('user_id', null);
      
    if (error) {
      console.error("Error fetching public notifications:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    return [];
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
      
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
};

