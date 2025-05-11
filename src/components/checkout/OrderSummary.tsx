
import { Separator } from '@/components/ui/separator';
import { Event } from '@/types';

interface OrderSummaryProps {
  event: Event;
  quantity: number;
}

const OrderSummary = ({ event, quantity }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

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
          <span>{formatPrice(event.price)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>{quantity}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(event.price * quantity)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>{formatPrice(event.price * quantity * 0.05)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-nepal-red">
          {formatPrice(event.price * quantity * 1.05)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
