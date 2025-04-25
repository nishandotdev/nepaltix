import { supabase } from "@/integrations/supabase/client";
import { Event, DigitalTicket, Notification, UserRole, NotificationType } from "@/types";

// Import the notification functions from our auth module
import { 
  addNotification as createAuthNotification,
  getAllNotifications,
  markNotificationAsRead
} from "./auth/notifications";

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
      
      // Map DB fields to our frontend model
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        shortDescription: event.short_description,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        category: event.category,
        imageUrl: event.image_url,
        tags: event.tags,
        featured: event.featured,
        totalTickets: event.total_tickets,
        availableTickets: event.available_tickets,
        createdBy: event.created_by,
        createdAt: event.created_at
      })) || [];
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
      
      if (!data) return null;
      
      // Map DB fields to our frontend model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category,
        imageUrl: data.image_url,
        tags: data.tags,
        featured: data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets,
        createdBy: data.created_by,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error("Error in getEventById:", error);
      return null;
    }
  }
  
  async addEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
    try {
      // Map frontend model to DB fields
      const dbEvent = {
        title: event.title,
        description: event.description,
        short_description: event.shortDescription,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        category: event.category,
        image_url: event.imageUrl,
        tags: event.tags,
        featured: event.featured,
        total_tickets: event.totalTickets,
        available_tickets: event.availableTickets,
        created_by: event.createdBy,
        created_at: event.createdAt
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([dbEvent])
        .select()
        .single();
      
      if (error) {
        console.error("Error adding event:", error);
        return null;
      }
      
      if (!data) return null;
      
      // Map DB response back to frontend model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category,
        imageUrl: data.image_url,
        tags: data.tags,
        featured: data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets,
        createdBy: data.created_by,
        createdAt: data.created_at
      };
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
      
      // Map DB fields to our frontend model
      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code,
        used: ticket.used,
        purchaseDate: ticket.purchase_date
      })) || [];
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
      
      if (error || !data) {
        console.error("Error fetching ticket by ID:", error);
        return null;
      }
      
      // Map DB fields to our frontend model
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type,
        quantity: data.quantity,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code,
        used: data.used,
        purchaseDate: data.purchase_date
      };
    } catch (error) {
      console.error("Error in getTicketById:", error);
      return null;
    }
  }
  
  async addTicket(ticket: Omit<DigitalTicket, 'id'>): Promise<DigitalTicket | null> {
    try {
      // Map frontend model to DB fields
      const dbTicket = {
        event_id: ticket.eventId,
        customer_id: ticket.customerId,
        ticket_type: ticket.ticketType,
        quantity: ticket.quantity,
        qr_code: ticket.qrCode,
        barcode: ticket.barcode,
        access_code: ticket.accessCode,
        used: ticket.used,
        purchase_date: ticket.purchaseDate
      };
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([dbTicket])
        .select()
        .single();
      
      if (error) {
        console.error("Error adding ticket:", error);
        return null;
      }
      
      if (!data) return null;
      
      // Map DB response back to frontend model
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type,
        quantity: data.quantity,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code,
        used: data.used,
        purchaseDate: data.purchase_date
      };
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
      
      // Map DB fields to our frontend model
      return data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.created_at
      })) || [];
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
      
      if (error || !data) {
        console.error("Error fetching notification by ID:", error);
        return null;
      }
      
      // Map DB fields to our frontend model
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        createdAt: data.created_at
      };
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
  
  async getAllNotifications(): Promise<Notification[]> {
    const notifications = await getAllNotifications();
    return notifications.map((notification: any) => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.created_at
    }));
  }
  
  async markNotificationAsRead(id: string): Promise<boolean> {
    return markNotificationAsRead(id);
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
