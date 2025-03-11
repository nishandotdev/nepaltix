
import { DigitalTicket, Event, Notification, NotificationType, PaymentMethod } from "@/types";
import { events as initialEvents } from "@/data/events";

// Mock database using local storage
class DbService {
  private storagePrefix = 'nepal_ticketing_';
  
  constructor() {
    this.initializeStorage();
  }
  
  private initializeStorage() {
    if (!localStorage.getItem(`${this.storagePrefix}events`)) {
      localStorage.setItem(`${this.storagePrefix}events`, JSON.stringify(initialEvents));
    }
    
    if (!localStorage.getItem(`${this.storagePrefix}tickets`)) {
      localStorage.setItem(`${this.storagePrefix}tickets`, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(`${this.storagePrefix}notifications`)) {
      localStorage.setItem(`${this.storagePrefix}notifications`, JSON.stringify([]));
    }
  }
  
  // Events
  getAllEvents(): Event[] {
    const events = localStorage.getItem(`${this.storagePrefix}events`);
    return events ? JSON.parse(events) : [];
  }
  
  getEventById(id: string): Event | undefined {
    const events = this.getAllEvents();
    return events.find(event => event.id === id);
  }
  
  updateEvent(updatedEvent: Event): void {
    const events = this.getAllEvents();
    const index = events.findIndex(event => event.id === updatedEvent.id);
    
    if (index !== -1) {
      events[index] = updatedEvent;
      localStorage.setItem(`${this.storagePrefix}events`, JSON.stringify(events));
    }
  }
  
  // Tickets
  getAllTickets(): DigitalTicket[] {
    const tickets = localStorage.getItem(`${this.storagePrefix}tickets`);
    return tickets ? JSON.parse(tickets) : [];
  }
  
  getTicketById(id: string): DigitalTicket | undefined {
    const tickets = this.getAllTickets();
    return tickets.find(ticket => ticket.id === id);
  }
  
  getTicketsByEventId(eventId: string): DigitalTicket[] {
    const tickets = this.getAllTickets();
    return tickets.filter(ticket => ticket.eventId === eventId);
  }
  
  createTicket(ticket: DigitalTicket): DigitalTicket {
    const tickets = this.getAllTickets();
    tickets.push(ticket);
    localStorage.setItem(`${this.storagePrefix}tickets`, JSON.stringify(tickets));
    
    // Update event available tickets
    const event = this.getEventById(ticket.eventId);
    if (event) {
      event.availableTickets -= ticket.quantity;
      this.updateEvent(event);
    }
    
    return ticket;
  }
  
  updateTicket(updatedTicket: DigitalTicket): void {
    const tickets = this.getAllTickets();
    const index = tickets.findIndex(ticket => ticket.id === updatedTicket.id);
    
    if (index !== -1) {
      tickets[index] = updatedTicket;
      localStorage.setItem(`${this.storagePrefix}tickets`, JSON.stringify(tickets));
    }
  }
  
  // Notifications
  getAllNotifications(): Notification[] {
    const notifications = localStorage.getItem(`${this.storagePrefix}notifications`);
    return notifications ? JSON.parse(notifications) : [];
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
    
    notifications.push(newNotification);
    localStorage.setItem(`${this.storagePrefix}notifications`, JSON.stringify(notifications));
    return newNotification;
  }
  
  markNotificationAsRead(id: string): void {
    const notifications = this.getAllNotifications();
    const index = notifications.findIndex(notif => notif.id === id);
    
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem(`${this.storagePrefix}notifications`, JSON.stringify(notifications));
    }
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
