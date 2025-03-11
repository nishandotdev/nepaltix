
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Ticket, 
  ChevronLeft,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { events } from '@/data/events';
import { useToast } from '@/components/ui/use-toast';
import NotFound from './NotFound';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return <NotFound />;
  }

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

  const handleTicketQuantityChange = (delta: number) => {
    const newQuantity = ticketQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= event.availableTickets) {
      setTicketQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href
      }).catch(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Event link has been copied to your clipboard."
        });
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      toast({
        title: "Copied to clipboard!",
        description: "Event link has been copied to your clipboard."
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-white dark:bg-gray-900 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <Link 
            to="/events" 
            className="inline-flex items-center text-sm font-medium text-nepal-red hover:text-nepal-red/90 mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to events
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full object-cover aspect-[16/9]"
                />
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
              
              <div className="mt-8">
                <Badge className="mb-3 bg-nepal-red/10 text-nepal-red hover:bg-nepal-red/20 border-none">
                  {event.category}
                </Badge>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <div key={index} className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
                        <Tag className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Price per ticket</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(event.price)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                    <span className="font-medium text-gray-900 dark:text-white">{event.availableTickets}</span>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of tickets
                    </label>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleTicketQuantityChange(-1)}
                        disabled={ticketQuantity <= 1}
                        className="px-3 py-2 border-r text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={event.availableTickets}
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 text-center py-2 border-none focus:ring-0 focus:outline-none dark:bg-gray-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleTicketQuantityChange(1)}
                        disabled={ticketQuantity >= event.availableTickets}
                        className="px-3 py-2 border-l text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                    <span className="text-xl font-bold text-nepal-red">{formatPrice(event.price * ticketQuantity)}</span>
                  </div>
                  
                  <Link to={`/checkout/${event.id}?quantity=${ticketQuantity}`} className="w-full">
                    <Button className="w-full gap-2 bg-nepal-red hover:bg-nepal-red/90">
                      <Ticket className="h-4 w-4" />
                      Book Now
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Tickets cannot be refunded or exchanged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EventDetails;
