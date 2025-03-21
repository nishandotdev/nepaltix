
import { DigitalTicket, Event, Notification, NotificationType, PaymentMethod } from "@/types";
import { events as initialEvents } from "@/data/events";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Database service using Supabase
class DbService {
  private storagePrefix = 'nepal_ticketing_';
  
  constructor() {
    this.initializeEvents();
  }
  
  private async initializeEvents() {
    // Check if events exist in the database
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error("Error checking events:", error);
      return;
    }
    
    // If no events, seed the database with initial events
    if (data.length === 0) {
      for (const event of initialEvents) {
        const { error: insertError } = await supabase
          .from('events')
          .insert({
            id: event.id,
            title: event.title,
            description: event.description,
            short_description: event.shortDescription,
            date: event.date,
            time: event.time,
            location: event.location,
            price: event.price,
            image_url: event.imageUrl,
            category: event.category,
            featured: event.featured,
            total_tickets: event.totalTickets,
            available_tickets: event.availableTickets,
            tags: event.tags
          });
          
        if (insertError) {
          console.error("Error inserting event:", insertError);
        }
      }
    }
  }
  
  getStoragePrefix(): string {
    return this.storagePrefix;
  }
  
  // Events
  async getAllEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
        
      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        return [];
      }
      
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        shortDescription: event.short_description,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        imageUrl: event.image_url,
        category: event.category,
        featured: event.featured || false,
        totalTickets: event.total_tickets,
        availableTickets: event.available_tickets,
        tags: event.tags || []
      }));
    } catch (error) {
      console.error("Error in getAllEvents:", error);
      toast.error("Failed to load events");
      return [];
    }
  }
  
  async getEventById(id: string): Promise<Event | undefined> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) {
        console.error("Error fetching event:", error);
        return undefined;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        imageUrl: data.image_url,
        category: data.category,
        featured: data.featured || false,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets,
        tags: data.tags || []
      };
    } catch (error) {
      console.error("Error in getEventById:", error);
      return undefined;
    }
  }
  
  async updateEvent(updatedEvent: Event): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: updatedEvent.title,
          description: updatedEvent.description,
          short_description: updatedEvent.shortDescription,
          date: updatedEvent.date,
          time: updatedEvent.time,
          location: updatedEvent.location,
          price: updatedEvent.price,
          image_url: updatedEvent.imageUrl,
          category: updatedEvent.category,
          featured: updatedEvent.featured,
          total_tickets: updatedEvent.totalTickets,
          available_tickets: updatedEvent.availableTickets,
          tags: updatedEvent.tags
        })
        .eq('id', updatedEvent.id);
        
      if (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      toast.error("Failed to update event");
      return false;
    }
  }
  
  async createEvent(newEvent: Omit<Event, 'id'>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          short_description: newEvent.shortDescription,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          price: newEvent.price,
          image_url: newEvent.imageUrl,
          category: newEvent.category,
          featured: newEvent.featured,
          total_tickets: newEvent.totalTickets,
          available_tickets: newEvent.availableTickets,
          tags: newEvent.tags
        })
        .select()
        .single();
        
      if (error || !data) {
        console.error("Error creating event:", error);
        toast.error("Failed to create event");
        return null;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        imageUrl: data.image_url,
        category: data.category,
        featured: data.featured || false,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets,
        tags: data.tags || []
      };
    } catch (error) {
      console.error("Error in createEvent:", error);
      toast.error("Failed to create event");
      return null;
    }
  }
  
  // Tickets
  async getAllTickets(): Promise<DigitalTicket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*');
        
      if (error) {
        console.error("Error fetching tickets:", error);
        return [];
      }
      
      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        purchaseDate: ticket.purchase_date,
        used: ticket.used,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code
      }));
    } catch (error) {
      console.error("Error in getAllTickets:", error);
      return [];
    }
  }
  
  async getTicketById(id: string): Promise<DigitalTicket | undefined> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error || !data) {
        console.error("Error fetching ticket:", error);
        return undefined;
      }
      
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type,
        quantity: data.quantity,
        purchaseDate: data.purchase_date,
        used: data.used,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code
      };
    } catch (error) {
      console.error("Error in getTicketById:", error);
      return undefined;
    }
  }
  
  async getTicketsByEventId(eventId: string): Promise<DigitalTicket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);
        
      if (error) {
        console.error("Error fetching tickets by event ID:", error);
        return [];
      }
      
      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        purchaseDate: ticket.purchase_date,
        used: ticket.used,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code
      }));
    } catch (error) {
      console.error("Error in getTicketsByEventId:", error);
      return [];
    }
  }
  
  async getTicketsByUserId(userId: string): Promise<DigitalTicket[]> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('customer_id', userId);
        
      if (error) {
        console.error("Error fetching tickets by user ID:", error);
        return [];
      }
      
      return data.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        customerId: ticket.customer_id,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        purchaseDate: ticket.purchase_date,
        used: ticket.used,
        qrCode: ticket.qr_code,
        barcode: ticket.barcode,
        accessCode: ticket.access_code
      }));
    } catch (error) {
      console.error("Error in getTicketsByUserId:", error);
      return [];
    }
  }
  
  async createTicket(ticket: Omit<DigitalTicket, 'id'>): Promise<DigitalTicket | null> {
    try {
      // First update event available tickets
      const event = await this.getEventById(ticket.eventId);
      if (!event) {
        toast.error("Event not found");
        return null;
      }
      
      if (event.availableTickets < ticket.quantity) {
        toast.error("Not enough tickets available");
        return null;
      }
      
      // Update available tickets
      const updatedEvent = {
        ...event,
        availableTickets: event.availableTickets - ticket.quantity
      };
      
      const eventUpdateSuccess = await this.updateEvent(updatedEvent);
      if (!eventUpdateSuccess) {
        toast.error("Failed to update ticket availability");
        return null;
      }
      
      // Create the ticket
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          event_id: ticket.eventId,
          customer_id: ticket.customerId,
          ticket_type: ticket.ticketType,
          quantity: ticket.quantity,
          used: ticket.used,
          qr_code: ticket.qrCode,
          barcode: ticket.barcode,
          access_code: ticket.accessCode
        })
        .select()
        .single();
        
      if (error || !data) {
        console.error("Error creating ticket:", error);
        // Try to rollback event update
        await this.updateEvent(event);
        toast.error("Failed to create ticket");
        return null;
      }
      
      return {
        id: data.id,
        eventId: data.event_id,
        customerId: data.customer_id,
        ticketType: data.ticket_type,
        quantity: data.quantity,
        purchaseDate: data.purchase_date,
        used: data.used,
        qrCode: data.qr_code,
        barcode: data.barcode,
        accessCode: data.access_code
      };
    } catch (error) {
      console.error("Error in createTicket:", error);
      toast.error("Failed to create ticket");
      return null;
    }
  }
  
  async updateTicket(updatedTicket: DigitalTicket): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          ticket_type: updatedTicket.ticketType,
          quantity: updatedTicket.quantity,
          used: updatedTicket.used,
          qr_code: updatedTicket.qrCode,
          barcode: updatedTicket.barcode,
          access_code: updatedTicket.accessCode
        })
        .eq('id', updatedTicket.id);
        
      if (error) {
        console.error("Error updating ticket:", error);
        toast.error("Failed to update ticket");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateTicket:", error);
      toast.error("Failed to update ticket");
      return false;
    }
  }
  
  // Notifications
  async getAllNotifications(): Promise<Notification[]> {
    // Use localStorage for notifications as they're not critical
    const notifications = localStorage.getItem(`${this.storagePrefix}notifications`);
    return notifications ? JSON.parse(notifications) : [];
  }
  
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.getAllNotifications();
    return notifications.filter(notif => notif.userId === userId || notif.userId === undefined);
  }
  
  addNotification(title: string, message: string, type: NotificationType, userId?: string): Notification {
    const notifications = this.getAllNotifications();
    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.then(notifs => {
      const updatedNotifications = [...notifs, newNotification];
      localStorage.setItem(`${this.storagePrefix}notifications`, JSON.stringify(updatedNotifications));
    });
    
    return newNotification;
  }
  
  markNotificationAsRead(id: string): void {
    this.getAllNotifications().then(notifications => {
      const index = notifications.findIndex(notif => notif.id === id);
      
      if (index !== -1) {
        notifications[index].read = true;
        localStorage.setItem(`${this.storagePrefix}notifications`, JSON.stringify(notifications));
      }
    });
  }
  
  // Payment processing (mock)
  processPayment(amount: number, paymentMethod: PaymentMethod, paymentDetails: any): Promise<{ success: boolean, transactionId: string }> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Mock successful payment (in a real app, this would connect to a payment gateway)
        const success = true;
        const transactionId = `TRANS_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        resolve({ success, transactionId });
      }, 1500);
    });
  }
}

export const dbService = new DbService();
