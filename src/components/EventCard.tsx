
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';
import SoldOutBadge from './SoldOutBadge';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
  featured?: boolean;
  onClick?: () => void;
}

const EventCard = ({ event, featured = false, onClick }: EventCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format date in a performant way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formattedDate = formatDate(event.date);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formattedPrice = formatPrice(event.price);

  const getSoldPercentage = (total: number, available: number) => {
    if (total <= 0) return 0;
    const sold = total - available;
    return (sold / total) * 100;
  };

  const soldPercentage = getSoldPercentage(event.totalTickets, event.availableTickets);
  const isSoldOut = event.availableTickets <= 0;
  const isPastEvent = new Date(event.date) < new Date();
  
  // Determine ticket availability status
  const getAvailabilityStatus = () => {
    if (isSoldOut) {
      return { text: "Sold Out", color: "bg-red-100 text-red-800 border-red-200" };
    } else if (soldPercentage >= 80) {
      return { text: "Selling Fast", color: "bg-orange-100 text-orange-800 border-orange-200" };
    } else if (isPastEvent) {
      return { text: "Event Ended", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
    return { text: `${event.availableTickets} tickets left`, color: "bg-green-100 text-green-800 border-green-200" };
  };

  const availabilityStatus = getAvailabilityStatus();

  const handleCardClick = (e: React.MouseEvent) => {
    // If onClick prop is provided, use that instead of the default Link behavior
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full hardware-accelerated"
      onClick={handleCardClick}
    >
      <Link 
        to={`/events/${event.id}`}
        className={`block overflow-hidden transition-all duration-300 h-full ${
          featured 
            ? 'rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:shadow-lg' 
            : 'rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm hover:shadow-md'
        }`}
      >
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          )}
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60"></div>
          
          {event.featured && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
              <Badge className="bg-nepal-red text-white border-none px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium">
                Featured
              </Badge>
            </div>
          )}
          
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <Badge className={`${availabilityStatus.color} border px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm`}>
              {availabilityStatus.text}
            </Badge>
          </div>
          
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="transform rotate-45 bg-red-600 text-white py-1 px-12 sm:px-16 font-bold text-lg sm:text-xl shadow-lg">
                SOLD OUT
              </div>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 text-white">
            <div className="space-y-1 sm:space-y-2">
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-nepal-cream bg-black/50 px-2 py-0.5 rounded-sm backdrop-blur-sm">
                {event.category}
              </span>
              <h3 className={`font-serif font-bold ${featured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'} line-clamp-2`}>
                {event.title}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {event.shortDescription}
          </p>
          
          <div className="grid grid-cols-1 gap-1 sm:gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 flex-shrink-0 text-nepal-red/70" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 flex-shrink-0 text-nepal-red/70" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 flex-shrink-0 text-nepal-red/70" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          
          <div className="pt-1 sm:pt-2 flex items-center justify-between">
            <div className="font-medium text-xs sm:text-sm md:text-base text-nepal-red">
              {formattedPrice}
            </div>
            
            {!isSoldOut && (
              <div className="relative w-16 sm:w-20 md:w-24 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-nepal-red"
                  initial={{ width: 0 }}
                  animate={{ width: `${soldPercentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                ></motion.div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
