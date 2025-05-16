
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const fallbackImage = "/placeholder.svg"; // Local placeholder fallback

const EventCard = ({ event, featured }: EventCardProps) => {
  // Internal state for image loading/error
  const [imgSrc, setImgSrc] = useState(event.imageUrl || fallbackImage);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card className={`transition-all duration-300 shadow hover:shadow-lg rounded-xl overflow-hidden ${featured ? 'border-2 border-nepal-red' : ''}`}>
      <Link to={`/events/${event.id}`}>
        <div className="relative w-full h-44 bg-gray-200 dark:bg-gray-700">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
            </div>
          )}
          <img
            src={imgSrc}
            alt={event.title}
            className={`object-cover w-full h-full transition-opacity duration-150 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgSrc(fallbackImage)}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{event.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">
            {event.shortDescription}
          </p>
          <div className="text-xs text-gray-400 dark:text-gray-400">{event.location}</div>
          <div className="text-xs text-gray-400 dark:text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.time}</div>
          <div className="mt-2 font-bold text-nepal-red">{event.price ? `NPR ${event.price}` : 'Free'}</div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default EventCard;
