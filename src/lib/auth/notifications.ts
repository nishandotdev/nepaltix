
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
    // Use the rpc call to execute raw SQL, bypassing the TypeScript type checking
    const { error } = await supabase.rpc('insert_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_read: false
    }).single();
    
    if (error) {
      console.error("Error adding notification:", error);
      return false;
    }
    
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
    // Use a raw query to fetch from the notifications table
    const { data, error } = await supabase.rpc('get_public_notifications');
      
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
    // Use a raw query to update the notifications table
    const { error } = await supabase.rpc('mark_notification_read', {
      p_notification_id: id
    });
      
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
