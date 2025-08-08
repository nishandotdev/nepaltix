
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const fallbackImage = "/placeholder.svg";

const EventCard = ({ event, featured }: EventCardProps) => {
  const [imgSrc, setImgSrc] = useState(event.imageUrl || fallbackImage);
  const [imgLoaded, setImgLoaded] = useState(false);

  const availabilityPercentage = (event.availableTickets / event.totalTickets) * 100;
  const isLowAvailability = availabilityPercentage < 20;
  const isSoldOut = event.availableTickets === 0;

  return (
    <Card className={`group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${featured ? 'ring-2 ring-nepal-red/20' : ''}`}>
      <Link to={`/events/${event.id}`}>
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
              </div>
            )}
            <img
              src={imgSrc}
              alt={event.title}
              className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgSrc(fallbackImage)}
            />
            
            {/* Status badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {featured && (
                <Badge className="bg-nepal-red text-white border-0 font-medium">
                  Featured
                </Badge>
              )}
              {isSoldOut ? (
                <Badge variant="destructive" className="border-0 font-medium">
                  Sold Out
                </Badge>
              ) : isLowAvailability && (
                <Badge className="bg-orange-500 text-white border-0 font-medium">
                  Limited
                </Badge>
              )}
            </div>

            {/* Price badge */}
            <div className="absolute top-3 right-3">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-sm font-bold text-nepal-red">
                  {event.price ? `NPR ${event.price}` : 'Free'}
                </span>
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-nepal-red transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {event.shortDescription}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <Clock className="w-3.5 h-3.5 ml-4 mr-2 flex-shrink-0" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Users className="w-3.5 h-3.5 mr-2" />
                    <span>{event.availableTickets} / {event.totalTickets} spots</span>
                  </div>
                  
                  {/* Availability indicator */}
                  <div className="flex items-center">
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isSoldOut ? 'bg-red-500' : 
                          isLowAvailability ? 'bg-orange-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.max(availabilityPercentage, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      +{event.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};

export default EventCard;
