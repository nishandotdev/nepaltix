
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Ticket, 
  ChevronLeft,
  Share2,
  Star,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { TicketType } from '@/types';
import NotFound from './NotFound';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SoldOutBadge from '@/components/SoldOutBadge';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/lib/eventService';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>(TicketType.STANDARD);
  
  // Fetch event data using React Query
  const { 
    data: event, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id || ''),
    meta: {
      onSettled: (data, error) => {
        if (error || !data) {
          console.error("Error fetching event:", error || "Event not found");
        }
      }
    }
  });
  
  // Redirect to NotFound if event is not found
  if (isError || (!isLoading && !event)) {
    return <NotFound />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-nepal-red animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isSoldOut = event.availableTickets <= 0;
  const eventHasPassed = new Date(event.date) < new Date();

  // Determine if this is a concert/music event or sports event
  const isMusicEvent = event.category === 'MUSIC' || event.tags.some(tag => 
    ['Music', 'Concert', 'Festival', 'Band', 'Live Music'].includes(tag)
  );
  
  const isSportsEvent = event.category === 'SPORTS' || event.tags.some(tag => 
    ['Sports', 'Game', 'Match', 'Tournament', 'Competition'].includes(tag)
  );

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

  const getTicketPrice = () => {
    let basePrice = event.price;
    switch (selectedTicketType) {
      case TicketType.VIP:
        return basePrice * 2.5; // VIP tickets cost 2.5x more
      case TicketType.FAN_ZONE:
        return basePrice * 1.5; // Fan Zone tickets cost 1.5x more
      case TicketType.EARLY_BIRD:
        return basePrice * 0.8; // Early Bird tickets cost 20% less
      default:
        return basePrice;
    }
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

  // Calculate remaining ticket percentage
  const remainingTicketsPercentage = (event.availableTickets / event.totalTickets) * 100;
  const showLowTicketWarning = !isSoldOut && remainingTicketsPercentage <= 20;

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
                
                {isSoldOut && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="transform rotate-45 bg-red-600 text-white py-2 px-24 font-bold text-2xl shadow-lg">
                      SOLD OUT
                    </div>
                  </div>
                )}
                
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
                
                {eventHasPassed && (
                  <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription>
                      This event has already taken place.
                    </AlertDescription>
                  </Alert>
                )}
                
                {isSoldOut ? (
                  <div className="text-center py-8">
                    <SoldOutBadge size="large" className="mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Sorry, all tickets for this event have been sold.
                    </p>
                    <Link to="/events">
                      <Button variant="outline" className="mt-2">
                        Browse Other Events
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {showLowTicketWarning && (
                      <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertDescription>
                          Only {event.availableTickets} tickets left! Book quickly.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Tabs defaultValue="STANDARD" className="mb-6" onValueChange={(value) => {
                      setSelectedTicketType(value as TicketType);
                    }}>
                      <TabsList className="grid grid-cols-2 mb-2">
                        <TabsTrigger value="STANDARD">Standard</TabsTrigger>
                        {isMusicEvent ? (
                          <TabsTrigger value="VIP">VIP Pass</TabsTrigger>
                        ) : isSportsEvent ? (
                          <TabsTrigger value="FAN_ZONE">Fan Zone</TabsTrigger>
                        ) : (
                          <TabsTrigger value="EARLY_BIRD">Early Bird</TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="STANDARD" className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Standard entry to the event
                        </p>
                      </TabsContent>
                      
                      {isMusicEvent && (
                        <TabsContent value="VIP" className="space-y-2">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                            <h4 className="flex items-center font-medium text-yellow-800 dark:text-yellow-400">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              VIP & Backstage Pass
                            </h4>
                            <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                              • Premium viewing area near the stage<br />
                              • Meet & greet with artists (30 min)<br />
                              • Exclusive VIP lounge access<br />
                              • Complimentary drinks
                            </p>
                          </div>
                        </TabsContent>
                      )}
                      
                      {isSportsEvent && (
                        <TabsContent value="FAN_ZONE" className="space-y-2">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <h4 className="flex items-center font-medium text-blue-800 dark:text-blue-400">
                              <Star className="h-4 w-4 mr-1 text-blue-500" />
                              Team Fan Zone
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                              • Seating in dedicated fan section<br />
                              • Team colors & chant sheets<br />
                              • Fan zone exclusive merchandise<br />
                              • Pre-game fan activities
                            </p>
                          </div>
                        </TabsContent>
                      )}
                      
                      {!isMusicEvent && !isSportsEvent && (
                        <TabsContent value="EARLY_BIRD" className="space-y-2">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <h4 className="flex items-center font-medium text-green-800 dark:text-green-400">
                              <Star className="h-4 w-4 mr-1 text-green-500" />
                              Early Bird Special
                            </h4>
                            <p className="text-sm text-green-800 dark:text-green-400 mt-1">
                              • Discounted price<br />
                              • Early entry (30 min before standard)<br />
                              • Limited availability
                            </p>
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Price per ticket</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatPrice(getTicketPrice())}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Available tickets</span>
                        <span className="font-medium text-gray-900 dark:text-white">{event.availableTickets}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-nepal-red h-2.5 rounded-full" style={{ width: `${(event.totalTickets - event.availableTickets) / event.totalTickets * 100}%` }}></div>
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
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              if (val >= 1 && val <= event.availableTickets) {
                                setTicketQuantity(val);
                              }
                            }}
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
                        <span className="text-xl font-bold text-nepal-red">{formatPrice(getTicketPrice() * ticketQuantity)}</span>
                      </div>
                      
                      <Link to={`/checkout/${event.id}?quantity=${ticketQuantity}&type=${selectedTicketType}`} className="w-full">
                        <Button className="w-full gap-2 bg-nepal-red hover:bg-nepal-red/90" disabled={eventHasPassed}>
                          <Ticket className="h-4 w-4" />
                          Book Now
                        </Button>
                      </Link>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Tickets cannot be refunded or exchanged.
                      </p>
                    </div>
                  </>
                )}
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
