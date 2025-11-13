
import { Separator } from '@/components/ui/separator';
import { Event, TicketType } from '@/types';

interface OrderSummaryProps {
  event: Event;
  quantity: number;
  ticketType: string;
}

const OrderSummary = ({ event, quantity, ticketType }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTicketPrice = () => {
    let basePrice = event.price;
    switch (ticketType) {
      case TicketType.VIP:
        return basePrice * 2.5;
      case TicketType.FAN_ZONE:
        return basePrice * 1.5;
      case TicketType.EARLY_BIRD:
        return basePrice * 0.8;
      default:
        return basePrice;
    }
  };

  const ticketPrice = getTicketPrice();
  const subtotal = ticketPrice * quantity;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(event.date).toLocaleDateString()}, {event.time}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Price per ticket</span>
          <span>{formatPrice(ticketPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>{quantity}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-nepal-red">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
