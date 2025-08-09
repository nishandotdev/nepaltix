import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dbService } from '@/lib/dbService';
import { authService } from '@/lib/authService';
import { paymentService } from '@/lib/paymentService';
import { 
  Customer, 
  DigitalTicket, 
  TicketType, 
  NotificationType,
  Event as EventType,
  PaymentInfo,
  PaymentMethod
} from '@/types';
import NotFound from './NotFound';
import { Loader } from '@/components/ui/loader';
import LoadingState from '@/components/checkout/LoadingState';
import CustomerForm from '@/components/checkout/CustomerForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import TicketDisplay from '@/components/checkout/TicketDisplay';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const navigate = useNavigate();
  
  const { user } = authService.getCurrentUser();
  
  const [customer, setCustomer] = useState<Customer>({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: PaymentMethod.CARD,
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<DigitalTicket | null>(null);
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Helper function to validate UUID (v4 format)
  const isValidUUID = (id?: string) => {
    return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      const eventData = await dbService.getEventById(id);
      setEvent(eventData);
      setTimeout(() => setLoading(false), 300);
    };
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingState />
        <Footer />
      </>
    );
  }
  
  if (!event) {
    return <NotFound />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateForm = () => {
    // Auto-fill values in demo mode for faster processing
    if (!customer.name.trim()) {
      if (user?.name) {
        setCustomer(prev => ({ ...prev, name: user.name || 'Demo User' }));
      } else {
        toast.error("Name required");
        return false;
      }
    }
    
    if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) {
      if (user?.email) {
        setCustomer(prev => ({ ...prev, email: user.email }));
      } else {
        toast.error("Valid email required");
        return false;
      }
    }
    
    if (!customer.phone.trim() || !/^\d{10}$/.test(customer.phone.replace(/\D/g, ''))) {
      // Auto-fill demo phone in demo mode
      setCustomer(prev => ({ ...prev, phone: '9800123456' }));
    }
    
    return true;
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Process payment using the payment service
      await paymentService.processPayment(
        event.price * quantity, 
        paymentInfo, 
        () => {
          // On payment success
          processBooking();
        },
        (errorMessage) => {
          // On payment error
          toast.error("Payment Failed", {
            description: errorMessage || "There was an error processing your payment.",
          });
          setIsProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment Processing Error", {
        description: "There was an unexpected error. Please try again.",
      });
      setIsProcessingPayment(false);
    }
  };

  const processBooking = async () => {
    setIsSubmitting(true);
    setIsProcessingPayment(false);

    try {
      const ticketId = `TKT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const barcode = Date.now().toString().slice(-12);

      const isUserUUID = isValidUUID(user?.id);

      const newTicket: Omit<DigitalTicket, 'id'> = {
        eventId: event.id,
        // Use user ID if available, otherwise use a demo customer ID
        customerId: isUserUUID ? user?.id : `demo-${Date.now()}`,
        ticketType: TicketType.STANDARD,
        quantity,
        purchaseDate: new Date().toISOString(),
        used: false,
        qrCode: `${event.id}-${ticketId}-${quantity}`,
        barcode,
        accessCode
      };

      // Save ticket to database only if a valid userId is available (Supabase)
      let savedTicket;
      if (isUserUUID) {
        try {
          savedTicket = await dbService.createTicket(newTicket);
        } catch (error) {
          console.warn("Database save failed, using local ticket:", error);
          savedTicket = {
            ...newTicket,
            id: ticketId, // Add fake id locally for demo
          };
        }
      } else {
        // Fallback to local "success" for demo user
        savedTicket = {
          ...newTicket,
          id: ticketId, // Add fake id locally for demo
        };
      }

      if (savedTicket) {
        setTicketData(savedTicket);

        // Only add notification if valid UUID
        if (isUserUUID) {
          dbService.addNotification(
            "Booking Confirmed!",
            `Your ticket for ${event.title} has been confirmed.`,
            NotificationType.SUCCESS,
            user?.id
          );
        }

        toast.success("Booking Successful!", {
          description: "Your ticket has been booked successfully.",
          duration: 5000,
          icon: "✅",
        });

        setIsSuccess(true);

        setTimeout(() => {
          setShowTicket(true);
        }, 1000);
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      toast.error("Booking Failed", {
        description: "There was an error booking your ticket. Please try again.",
      });

      // Only add failed notification if valid UUID
      if (isValidUUID(user?.id)) {
        dbService.addNotification(
          "Booking Failed",
          "There was an error booking your ticket for an event.",
          NotificationType.ERROR,
          user?.id
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    processPayment();
  };

  const handleDownloadTicket = () => {
    if (!ticketData) return;
    
    // Create a virtual element
    const element = document.createElement('a');
    
    // Create a text representation of the ticket
    const ticketText = `
Nepal Ticket - Digital Ticket
Event: ${event.title}
Date: ${new Date(event.date).toLocaleDateString()}, ${event.time}
Location: ${event.location}
Ticket ID: ${ticketData.id}
Access Code: ${ticketData.accessCode}
Quantity: ${ticketData.quantity}
Customer: ${customer.name}
    `;
    
    // Create a blob from the text
    const file = new Blob([ticketText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ticket-${event.id}-${ticketData.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Simulate ticket download
    toast.success("Ticket Downloaded", {
      description: "Your digital ticket has been downloaded successfully.",
      icon: "📄",
    });
    
    // Add notification
    dbService.addNotification(
      "Ticket Downloaded",
      `Your ticket for ${event.title} has been downloaded.`,
      NotificationType.INFO,
      user?.id
    );
    
    // Redirect to home with payment success parameter
    setTimeout(() => {
      navigate('/?booking=success');
    }, 500);
  };

  if (showTicket && ticketData) {
    return (
      <>
        <Navbar />
        <div className="bg-white dark:bg-gray-900 min-h-[80vh] flex items-center justify-center">
          <TicketDisplay 
            ticketData={ticketData} 
            event={event} 
            customer={customer}
            onDownload={handleDownloadTicket}
            onReturn={() => navigate('/?booking=success')}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            to={`/events/${event.id}`} 
            className="inline-flex items-center text-sm font-medium text-nepal-red hover:text-nepal-red/90 mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to event
          </Link>
          
          {isSuccess ? (
            <LoadingState isSuccess />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                  <h1 className="text-2xl font-bold mb-6">Book Your Ticket</h1>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                        <CustomerForm 
                          initialCustomer={customer}
                          onChange={setCustomer}
                        />
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                        <PaymentMethodSelector 
                          initialPaymentInfo={paymentInfo}
                          onChange={setPaymentInfo}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-nepal-red hover:bg-nepal-red/90"
                        disabled={isSubmitting || isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader variant="white" size={18} className="mr-2" />
                            Processing Payment...
                          </>
                        ) : isSubmitting ? (
                          <>
                            <Loader variant="white" size={18} className="mr-2" />
                            Creating Booking...
                          </>
                        ) : (
                          <>
                            Pay & Book {formatPrice(event.price * quantity)}
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        This is a demo application. No actual payment will be processed.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <OrderSummary event={event} quantity={quantity} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
