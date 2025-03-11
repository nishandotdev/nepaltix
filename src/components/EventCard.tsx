
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Event } from '@/types';

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

  return (
    <Link 
      to={`/events/${event.id}`}
      className={`group block overflow-hidden transition-card ${
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
          className={`w-full h-full object-cover transition-image duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {event.featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-nepal-red text-white">
              Featured
            </span>
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
          
          <span className="inline-flex items-center text-xs font-medium">
            {event.availableTickets} tickets left
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
