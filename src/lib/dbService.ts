import { Event, DigitalTicket, Notification, UserRole, NotificationType, EventCategory, TicketType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Import the notification functions from our auth module
import { 
  addNotification as createAuthNotification,
  getAllNotifications,
  markNotificationAsRead
} from "./auth/notifications";

class DbService {
  // Events - with fallback to local data for faster loading
  async getEvents(): Promise<Event[]> {
    try {
      // Quick timeout to prevent long loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 2000)
      );
      
      const dbPromise = supabase
        .from('events')
        .select('*');
      
      const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn("Database not available, using local data:", error);
        // Return local fallback data
        return this.getFallbackEvents();
      }
      
      // Map DB fields to our frontend model with proper type conversion
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        shortDescription: event.short_description,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        category: event.category as EventCategory, // Convert string to enum
        imageUrl: event.image_url,
        tags: event.tags || [],
        featured: !!event.featured,
        totalTickets: event.total_tickets,
        availableTickets: event.available_tickets
      })) || [];
    } catch (error) {
      console.warn("Database connection failed, using local data:", error);
      return this.getFallbackEvents();
    }
  }

  private async getFallbackEvents(): Promise<Event[]> {
    // Import local events data as fallback
    const { events } = await import('@/data/events');
    return events;
  }
  
  async getEventById(id: string): Promise<Event | null> {
    try {
      // Quick timeout to prevent long loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 2000)
      );
      
      const dbPromise = supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;
      
      if (error || !data) {
        console.warn("Database not available, using local data for event:", id);
        // Fallback to local data
        const { events } = await import('@/data/events');
        return events.find(event => event.id === id) || null;
      }
      
      // Map DB fields to our frontend model with proper type conversion
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category as EventCategory, // Convert string to enum
        imageUrl: data.image_url,
        tags: data.tags || [],
        featured: !!data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets
      };
    } catch (error) {
      console.warn("Database connection failed, using local data for event:", id);
      const { events } = await import('@/data/events');
      return events.find(event => event.id === id) || null;
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
        available_tickets: event.availableTickets
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
      
      // Map DB response back to frontend model with proper type conversion
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category as EventCategory, // Convert string to enum
        imageUrl: data.image_url,
        tags: data.tags || [],
        featured: !!data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets
      };
    } catch (error) {
      console.error("Error in addEvent:", error);
      return null;
    }
  }
  
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      // Convert frontend model field names to database field names
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.time !== undefined) dbUpdates.time = updates.time;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.totalTickets !== undefined) dbUpdates.total_tickets = updates.totalTickets;
      if (updates.availableTickets !== undefined) dbUpdates.available_tickets = updates.availableTickets;
      
      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating event:", error);
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
        category: data.category as EventCategory,
        imageUrl: data.image_url,
        tags: data.tags || [],
        featured: !!data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets
      };
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
      
      // Map DB fields to our frontend model with proper type conversion
      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type as TicketType, // Convert string to enum
        quantity: ticket.quantity,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code,
        used: !!ticket.used,
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
      
      // Map DB fields to our frontend model with proper type conversion
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type as TicketType, // Convert string to enum
        quantity: data.quantity,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code,
        used: !!data.used,
        purchaseDate: data.purchase_date
      };
    } catch (error) {
      console.error("Error in getTicketById:", error);
      return null;
    }
  }
  
  async createTicket(ticket: Omit<DigitalTicket, 'id'>): Promise<DigitalTicket | null> {
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
      
      // Map DB response back to frontend model with proper type conversion
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type as TicketType, // Convert string to enum
        quantity: data.quantity,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code,
        used: !!data.used,
        purchaseDate: data.purchase_date
      };
    } catch (error) {
      console.error("Error in addTicket:", error);
      return null;
    }
  }
  
  async updateTicket(id: string, updates: Partial<DigitalTicket>): Promise<DigitalTicket | null> {
    try {
      // Convert frontend model field names to database field names
      const dbUpdates: any = {};
      
      if (updates.eventId !== undefined) dbUpdates.event_id = updates.eventId;
      if (updates.customerId !== undefined) dbUpdates.customer_id = updates.customerId;
      if (updates.ticketType !== undefined) dbUpdates.ticket_type = updates.ticketType;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.qrCode !== undefined) dbUpdates.qr_code = updates.qrCode;
      if (updates.barcode !== undefined) dbUpdates.barcode = updates.barcode;
      if (updates.accessCode !== undefined) dbUpdates.access_code = updates.accessCode;
      if (updates.used !== undefined) dbUpdates.used = updates.used;
      if (updates.purchaseDate !== undefined) dbUpdates.purchase_date = updates.purchaseDate;
      
      const { data, error } = await supabase
        .from('tickets')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating ticket:", error);
        return null;
      }
      
      if (!data) return null;
      
      // Map DB response back to frontend model with proper type conversion
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type as TicketType, // Convert string to enum
        quantity: data.quantity,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code,
        used: !!data.used,
        purchaseDate: data.purchase_date
      };
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
      const { data, error } = await supabase.rpc('get_user_notifications', { p_user_id: userId });
      
      if (error) {
        console.error("Error fetching notifications for user:", error);
        return [];
      }
      
      // Map the raw data to our frontend model
      return (data || []).map((notification: any) => ({
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        read: !!notification.read,
        createdAt: notification.created_at
      }));
    } catch (error) {
      console.error("Error in getNotificationsByUserId:", error);
      return [];
    }
  }
  
  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await supabase.rpc('get_notification_by_id', { p_notification_id: id });
      
      if (error || !data || data.length === 0) {
        console.error("Error fetching notification by ID:", error);
        return null;
      }
      
      const notification = data[0];
      // Map the raw data to our frontend model
      return {
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        read: !!notification.read,
        createdAt: notification.created_at
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
      type: notification.type as NotificationType,
      read: !!notification.read,
      createdAt: notification.created_at
    }));
  }
  
  async markNotificationAsRead(id: string): Promise<boolean> {
    return markNotificationAsRead(id);
  }
  
  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null> {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.read !== undefined) updateData.read = updates.read;
      
      const { data, error } = await supabase.rpc('update_notification', {
        p_notification_id: id,
        p_updates: updateData
      });
      
      if (error) {
        console.error("Error updating notification:", error);
        return null;
      }
      
      return this.getNotificationById(id);
    } catch (error) {
      console.error("Error in updateNotification:", error);
      return null;
    }
  }
  
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('delete_notification', {
        p_notification_id: id
      });
      
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

  // Add missing methods for tickets
  async getAllTickets(): Promise<DigitalTicket[]> {
    try {
      const { data, error } = await supabase.rpc('get_all_tickets');
      
      if (error) {
        console.error("Error fetching all tickets:", error);
        return [];
      }
      
      return (data || []).map((ticket: any) => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type as TicketType,
        quantity: ticket.quantity,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code,
        used: !!ticket.used,
        purchaseDate: ticket.purchase_date
      }));
    } catch (error) {
      console.error("Error in getAllTickets:", error);
      return [];
    }
  }


  // Simple mock payment processing (in a real app, this would be a proper payment processor)
  async processPayment(
    amount: number,
    paymentMethod: string,
    paymentDetails: any
  ): Promise<{ success: boolean; message: string }> {
    // Mock payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: "Payment processed successfully"
    };
  }
}

export const dbService = new DbService();
