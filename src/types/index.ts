
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
  MOVIES = 'MOVIES',
  FLIGHTS = 'FLIGHTS',
  TRANSPORTATION = 'TRANSPORTATION',
  ACCOMMODATION = 'ACCOMMODATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
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
  FAN_ZONE = 'FAN_ZONE',
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

export interface DigitalTicket {
  id: string;
  eventId: string;
  customerId: string | undefined; // Allow undefined for demo users
  ticketType: TicketType;
  quantity: number;
  purchaseDate: string;
  used: boolean;
  qrCode: string;
  barcode: string;
  accessCode: string;
  vipPerks?: string[];
  fanZoneSection?: string;
  teamColor?: string;
}

export interface OrganizerEvent extends Event {
  totalSales: number;
  checkedInAttendees: number;
}

export interface ScanResult {
  valid: boolean;
  message: string;
  ticketId?: string;
  eventTitle?: string;
  customerName?: string;
  customerEmail?: string;
  quantity?: number;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
  CARD = 'CARD',
  KHALTI = 'KHALTI',
  ESEWA = 'ESEWA',
  FONEPAY = 'FONEPAY',
  CONNECTIPS = 'CONNECTIPS',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  createdAt: string;
}

export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
