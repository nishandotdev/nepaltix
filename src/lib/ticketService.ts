
import { DigitalTicket, TicketType, Event, Customer, ScanResult } from '@/types';
import { events } from '@/data/events';

// In-memory storage for tickets (in a real app, this would be in a database)
let tickets: DigitalTicket[] = [];

// Generate a unique ticket ID
const generateTicketId = (): string => {
  return `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

// Generate a QR code (in a real app, this would generate an actual QR code)
const generateQRCode = (ticketId: string): string => {
  // This would be a URL or data to encode in the QR code
  return `https://nepal-tickets-hub.com/ticket/${ticketId}`;
};

// Generate a barcode (in a real app, this would generate an actual barcode)
const generateBarcode = (ticketId: string): string => {
  // This would be a data to encode in the barcode
  return `${ticketId}-${Date.now()}`;
};

// Generate an access code
const generateAccessCode = (): string => {
  // Generate a random 6-digit access code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Purchase tickets for an event
export const purchaseTickets = (
  eventId: string,
  customer: Customer,
  ticketType: TicketType = TicketType.STANDARD,
  quantity: number
): DigitalTicket | null => {
  const event = events.find(e => e.id === eventId);
  
  if (!event || event.availableTickets < quantity) {
    return null;
  }
  
  // Generate a unique customer ID (in a real app, this would be from authentication)
  const customerId = `CUST-${Math.random().toString(36).substring(2, 10)}`;
  
  // Create the ticket
  const ticket: DigitalTicket = {
    id: generateTicketId(),
    eventId,
    customerId,
    ticketType,
    quantity,
    purchaseDate: new Date().toISOString(),
    used: false,
    qrCode: '',
    barcode: '',
    accessCode: ''
  };
  
  // Generate QR code, barcode and access code
  ticket.qrCode = generateQRCode(ticket.id);
  ticket.barcode = generateBarcode(ticket.id);
  ticket.accessCode = generateAccessCode();
  
  // Save the ticket
  tickets.push(ticket);
  
  // Update event available tickets (in a real app, this would update the database)
  event.availableTickets -= quantity;
  
  return ticket;
};

// Get a ticket by ID
export const getTicketById = (ticketId: string): DigitalTicket | undefined => {
  return tickets.find(ticket => ticket.id === ticketId);
};

// Validate a ticket (for scanning)
export const validateTicket = (ticketId: string): ScanResult => {
  const ticket = tickets.find(ticket => ticket.id === ticketId);
  
  if (!ticket) {
    return {
      valid: false,
      message: 'Ticket not found'
    };
  }
  
  if (ticket.used) {
    return {
      valid: false,
      message: 'Ticket has already been used'
    };
  }
  
  const event = events.find(e => e.id === ticket.eventId);
  
  if (!event) {
    return {
      valid: false,
      message: 'Event not found'
    };
  }
  
  // Check if event date has passed
  if (new Date(event.date) < new Date()) {
    return {
      valid: false,
      message: 'Event has already ended'
    };
  }
  
  // Mark ticket as used (in a real app with a backend, this would update the database)
  ticket.used = true;
  
  return {
    valid: true,
    message: 'Ticket is valid',
    ticketId: ticket.id,
    eventTitle: event.title,
    quantity: ticket.quantity
  };
};

// Simulate ticket validation (for the scanner demo)
export const simulateTicketScan = (): ScanResult => {
  // Simulate a 20% chance of an invalid ticket
  const isValid = Math.random() > 0.2;
  
  if (!isValid) {
    const errorMessages = [
      'Ticket not found',
      'Ticket has already been used',
      'Invalid QR code',
      'Event has already ended'
    ];
    const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    return {
      valid: false,
      message: randomErrorMessage
    };
  }
  
  // Choose a random event
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  // Generate a random ticket ID
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  // Generate a random customer
  const names = ['John Doe', 'Jane Smith', 'Ram Sharma', 'Sita Rai', 'Anish Gurung'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomEmail = `${randomName.split(' ')[0].toLowerCase()}@example.com`;
  
  return {
    valid: true,
    message: 'Ticket is valid',
    ticketId: `TKT-${randomId}`,
    eventTitle: randomEvent.title,
    customerName: randomName,
    customerEmail: randomEmail,
    quantity: Math.floor(Math.random() * 3) + 1
  };
};
