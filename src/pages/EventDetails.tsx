
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, ArrowLeft, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Event, TicketType } from '@/types';
import { events } from '@/data/events';
import { useToast } from "@/hooks/use-toast";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType>(TicketType.STANDARD);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundEvent = events.find(e => e.id === id);
      
      if (foundEvent) {
        setEvent(foundEvent);
        document.title = `${foundEvent.title} - NepalTix`;
      } else {
        navigate('/events', { replace: true });
        toast({
          title: "Event not found",
          description: "The event you're looking for doesn't exist.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
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
    let basePrice = event?.price || 0;
    
    switch (selectedTicket) {
      case TicketType.VIP:
        return basePrice * 2;
      case TicketType.EARLY_BIRD:
        return Math.floor(basePrice * 0.8);
      case TicketType.STANDARD:
      default:
        return basePrice;
    }
  };

  const getTotalPrice = () => {
    return getTicketPrice() * quantity;
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} tickets for ${event?.title}`,
    });
    
    // In a real app, this would add to cart state or localStorage
    // For now, redirect to checkout
    navigate('/checkout', { 
      state: { 
        event,
        ticketType: selectedTicket,
        quantity,
        totalPrice: getTotalPrice()
      } 
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.shortDescription,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 max-w-2xl"></div>
              <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            to="/events"
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-nepal-red dark:hover:text-nepal-red mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-entrance">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                  {event.title}
                </h1>

                <div className="relative rounded-xl overflow-hidden mb-8">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className={`w-full h-auto object-cover rounded-xl transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-2 text-nepal-red" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-5 w-5 mr-2 text-nepal-red" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-2 text-nepal-red" />
                    <span>{event.location}</span>
                  </div>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red transition-colors duration-300 ml-auto"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      About This Event
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-entrance-delay-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Book Tickets
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Ticket Type
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <TicketOption
                        type={TicketType.STANDARD}
                        price={event.price}
                        selected={selectedTicket === TicketType.STANDARD}
                        onClick={() => setSelectedTicket(TicketType.STANDARD)}
                      />
                      
                      <TicketOption
                        type={TicketType.VIP}
                        price={event.price * 2}
                        selected={selectedTicket === TicketType.VIP}
                        onClick={() => setSelectedTicket(TicketType.VIP)}
                      />
                      
                      <TicketOption
                        type={TicketType.EARLY_BIRD}
                        price={Math.floor(event.price * 0.8)}
                        selected={selectedTicket === TicketType.EARLY_BIRD}
                        onClick={() => setSelectedTicket(TicketType.EARLY_BIRD)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-full">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className={`p-2 ${
                          quantity <= 1 
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red'
                        }`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="flex-1 text-center font-medium">
                        {quantity}
                      </span>
                      
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= 10}
                        className={`p-2 ${
                          quantity >= 10 
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Price per ticket
                      </span>
                      <span className="font-medium">
                        {formatPrice(getTicketPrice())}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">
                        Quantity
                      </span>
                      <span className="font-medium">
                        {quantity}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-nepal-red">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-lg bg-nepal-red text-white font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    Book Now
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Only {event.availableTickets} tickets left
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface TicketOptionProps {
  type: TicketType;
  price: number;
  selected: boolean;
  onClick: () => void;
}

const TicketOption = ({ type, price, selected, onClick }: TicketOptionProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDescription = () => {
    switch (type) {
      case TicketType.VIP:
        return 'Priority seating & special perks';
      case TicketType.EARLY_BIRD:
        return 'Limited quantity, discounted rate';
      case TicketType.STANDARD:
      default:
        return 'Regular admission ticket';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
        selected
          ? 'border-nepal-red bg-nepal-red/5'
          : 'border-gray-300 dark:border-gray-600 hover:border-nepal-red/60'
      }`}
    >
      <div className="flex items-center">
        <div className={`h-4 w-4 rounded-full border flex-shrink-0 ${
          selected 
            ? 'border-nepal-red bg-nepal-red' 
            : 'border-gray-400 dark:border-gray-500'
        }`}>
          {selected && (
            <div className="h-1.5 w-1.5 bg-white rounded-full m-auto"></div>
          )}
        </div>
        <div className="ml-3 text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {type.replace('_', ' ')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getDescription()}
          </div>
        </div>
      </div>
      <div className="font-medium text-nepal-red">
        {formatPrice(price)}
      </div>
    </button>
  );
};

export default EventDetails;
