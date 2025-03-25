import { supabase } from "@/integrations/supabase/client";
import { Event, DigitalTicket, Notification, UserRole, NotificationType } from "@/types";

// Import the notification function from our auth module
import { addNotification as createAuthNotification } from "./auth/dbNotifications";

class DbService {
  // Events
  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getEvents:", error);
      return [];
    }
  }
  
  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching event by ID:", error);
        return null;
      }
      
      return data || null;
    } catch (error) {
      console.error("Error in getEventById:", error);
      return null;
    }
  }
  
  async addEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();
      
      if (error) {
        console.error("Error adding event:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in addEvent:", error);
      return null;
    }
  }
  
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating event:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      return null;
    }
  }
  
  async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting event:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      return false;
    }
  }
  
  // Digital Tickets
  async getTicketsByUserId(userId: string): Promise<DigitalTicket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('customer_id', userId);
      
      if (error) {
        console.error("Error fetching tickets for user:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getTicketsByUserId:", error);
      return [];
    }
  }
  
  async getTicketById(id: string): Promise<DigitalTicket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching ticket by ID:", error);
        return null;
      }
      
      return data || null;
    } catch (error) {
      console.error("Error in getTicketById:", error);
      return null;
    }
  }
  
  async addTicket(ticket: Omit<DigitalTicket, 'id'>): Promise<DigitalTicket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticket])
        .select()
        .single();
      
      if (error) {
        console.error("Error adding ticket:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in addTicket:", error);
      return null;
    }
  }
  
  async updateTicket(id: string, updates: Partial<DigitalTicket>): Promise<DigitalTicket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating ticket:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in updateTicket:", error);
      return null;
    }
  }
  
  async deleteTicket(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting ticket:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteTicket:", error);
      return false;
    }
  }
  
  // Notifications
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications for user:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getNotificationsByUserId:", error);
      return [];
    }
  }
  
  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching notification by ID:", error);
        return null;
      }
      
      return data || null;
    } catch (error) {
      console.error("Error in getNotificationById:", error);
      return null;
    }
  }

  // Update the addNotification function to use our new module
  async addNotification(
    title: string,
    message: string,
    type: NotificationType,
    userId: string
  ): Promise<boolean> {
    return createAuthNotification(title, message, type, userId);
  }
  
  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating notification:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in updateNotification:", error);
      return null;
    }
  }
  
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting notification:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteNotification:", error);
      return false;
    }
  }
}

export const dbService = new DbService();
