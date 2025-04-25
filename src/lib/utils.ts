
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TicketType } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get a human-readable label for ticket types
export function getTicketTypeLabel(ticketType: TicketType): string {
  switch (ticketType) {
    case TicketType.STANDARD:
      return 'Standard Ticket';
    case TicketType.VIP:
      return 'VIP Access';
    case TicketType.EARLY_BIRD:
      return 'Early Bird Special';
    case TicketType.FAN_ZONE:
      return 'Fan Zone Access';
    default:
      return ticketType;
  }
}
