
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import SoldOutBadge from './SoldOutBadge';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const EventCard = ({ event, featured = false }: EventCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSoldPercentage = (total: number, available: number) => {
    if (total <= 0) return 0;
    const sold = total - available;
    return (sold / total) * 100;
  };

  const soldPercentage = getSoldPercentage(event.totalTickets, event.availableTickets);
  const isSoldOut = event.availableTickets <= 0;
  
  // Determine ticket availability status
  const getAvailabilityStatus = () => {
    if (isSoldOut) {
      return { text: "Sold Out", color: "bg-red-100 text-red-800 border-red-200" };
    } else if (soldPercentage >= 80) {
      return { text: "Selling Fast", color: "bg-orange-100 text-orange-800 border-orange-200" };
    } else if (new Date(event.date) < new Date()) {
      return { text: "Event Ended", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
    return { text: `${event.availableTickets} tickets left`, color: "bg-green-100 text-green-800 border-green-200" };
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <Link 
      to={`/events/${event.id}`}
      className={`group block overflow-hidden transition-all duration-300 ${
        featured 
          ? 'rounded-xl hover:shadow-xl' 
          : 'rounded-lg hover:shadow-md'
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={event.imageUrl}
          alt={event.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {event.featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-nepal-red text-white border-none">
              Featured
            </Badge>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${availabilityStatus.color} border`}>
            {availabilityStatus.text}
          </Badge>
        </div>
        
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="transform rotate-45 bg-red-600 text-white py-1 px-16 font-bold text-xl shadow-lg">
              SOLD OUT
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <div className="space-y-1">
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-nepal-cream bg-black/30 px-2 py-1 rounded-sm backdrop-blur-sm">
              {event.category}
            </span>
            <h3 className={`font-serif font-bold ${featured ? 'text-xl sm:text-2xl' : 'text-lg'} line-clamp-2`}>
              {event.title}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-5 bg-white dark:bg-gray-800 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {event.shortDescription}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="pt-2 flex items-center justify-between">
          <div className="font-medium text-nepal-red">
            {formatPrice(event.price)}
          </div>
          
          {!isSoldOut && (
            <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-nepal-red"
                style={{ width: `${soldPercentage}%` }}  
              ></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
