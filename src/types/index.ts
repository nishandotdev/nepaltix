
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  price: number;
  imageUrl: string;
  category: EventCategory;
  featured: boolean;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
}

export enum EventCategory {
  MUSIC = 'MUSIC',
  CULTURE = 'CULTURE',
  FESTIVAL = 'FESTIVAL',
  SPORTS = 'SPORTS',
  FOOD = 'FOOD',
  ADVENTURE = 'ADVENTURE',
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketType: TicketType;
  price: number;
  quantity: number;
}

export enum TicketType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  EARLY_BIRD = 'EARLY_BIRD',
}

export interface CartItem {
  ticket: Ticket;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}
