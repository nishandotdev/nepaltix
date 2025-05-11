
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  Receipt, 
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  User,
  Lock,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dbService } from '@/lib/dbService';
import { authService } from '@/lib/authService';
import { 
  Customer, 
  DigitalTicket, 
  TicketType, 
  PaymentMethod,
  PaymentInfo,
  NotificationType,
  Event
} from '@/types';
import NotFound from './NotFound';
import { Loader } from "@/components/ui/loader";

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
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    paymentMethod: PaymentMethod.CARD
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<DigitalTicket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader size={36} text="Loading checkout..." className="animate-pulse" />
        </div>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
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
    
    // Validate payment information based on method - auto-fill in demo mode
    if (paymentInfo.paymentMethod === PaymentMethod.CARD) {
      if (!paymentInfo.cardNumber.trim() || !/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\D/g, ''))) {
        setPaymentInfo(prev => ({ ...prev, cardNumber: '4111111111111111' }));
      }
      
      if (!paymentInfo.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        setPaymentInfo(prev => ({ ...prev, expiryDate: '12/25' }));
      }
      
      if (!paymentInfo.cvc.trim() || !/^\d{3}$/.test(paymentInfo.cvc)) {
        setPaymentInfo(prev => ({ ...prev, cvc: '123' }));
      }
    }
    
    return true;
  };

  const handleTabChange = (value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      paymentMethod: value as PaymentMethod
    }));
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Process payment via our mock payment service (now faster)
      const totalAmount = event.price * quantity * 1.05;
      const paymentDetails = paymentInfo.paymentMethod === PaymentMethod.CARD 
        ? { cardNumber: paymentInfo.cardNumber, expiryDate: paymentInfo.expiryDate, cvc: paymentInfo.cvc }
        : { userId: user?.id || 'guest-user' };
        
      const paymentResult = await dbService.processPayment(
        totalAmount,
        paymentInfo.paymentMethod,
        paymentDetails
      );
      
      if (paymentResult.success) {
        // Create digital ticket
        const ticketId = `TKT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
        const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const barcode = Date.now().toString().slice(-12);
        
        const newTicket: Omit<DigitalTicket, 'id'> = {
          eventId: event.id,
          customerId: user?.id || `CUST-${Math.random().toString(36).substring(2, 9)}`,
          ticketType: TicketType.STANDARD,
          quantity,
          purchaseDate: new Date().toISOString(),
          used: false,
          qrCode: `${event.id}-${ticketId}-${quantity}`,
          barcode,
          accessCode
        };
        
        // Save ticket to database
        const savedTicket = await dbService.createTicket(newTicket);
        if (savedTicket) {
          setTicketData(savedTicket);
          
          // Add notification
          dbService.addNotification(
            "Booking Confirmed!",
            `Your ticket for ${event.title} has been confirmed.`,
            NotificationType.SUCCESS,
            user?.id
          );
          
          // Show success toast
          toast.success("Payment Successful!", {
            description: "Your payment has been processed successfully.",
            duration: 5000,
            icon: "✅",
          });
          
          setIsSuccess(true);
          
          // Reduce delay before showing ticket in demo mode
          setTimeout(() => {
            setShowTicket(true);
          }, 1000);
        } else {
          throw new Error("Failed to create ticket");
        }
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      toast.error("Payment Failed", {
        description: "There was an error processing your payment. Please try again.",
      });
      
      // Add notification
      dbService.addNotification(
        "Payment Failed",
        "There was an error processing your payment for an event ticket.",
        NotificationType.ERROR,
        user?.id
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    handlePayment();
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
      navigate('/?payment=success');
    }, 500);
  };

  if (showTicket && ticketData) {
    return (
      <>
        <Navbar />
        <div className="bg-white dark:bg-gray-900 min-h-[80vh] flex items-center justify-center">
          <div className="container max-w-md mx-auto px-4 py-10">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your tickets for {event.title} have been booked.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md mb-6">
              <div className="p-4 bg-nepal-red/10 border-b border-nepal-red/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">E-Ticket</h3>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{ticketData.id}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-nepal-red" />
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-nepal-red mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(event.date).toLocaleDateString()}, {event.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-nepal-red mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-nepal-red mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{ticketData.quantity} ticket(s)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-nepal-red mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{customer.name}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-center mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Access Code</p>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded">
                      <p className="font-mono text-lg font-bold tracking-widest">{ticketData.accessCode}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Barcode</p>
                    <div className="inline-block">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded">
                        {/* Simple barcode representation */}
                        <div className="flex items-center justify-center space-x-0.5 h-12">
                          {ticketData.barcode.split('').map((digit, index) => (
                            <div 
                              key={index}
                              className="h-full w-0.5 bg-gray-900 dark:bg-gray-200"
                              style={{ 
                                height: `${Math.max(30, parseInt(digit) * 5 + 30)}%`,
                                width: parseInt(digit) % 2 === 0 ? '1px' : '2px'
                              }}
                            />
                          ))}
                        </div>
                        <p className="mt-2 font-mono text-xs">{ticketData.barcode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="h-3 w-3 mr-1" />
                  Secured with blockchain verification
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                variant="default" 
                className="w-full bg-nepal-red hover:bg-nepal-red/90"
                onClick={handleDownloadTicket}
              >
                Download Ticket
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/?payment=success')}
              >
                Return to Home
              </Button>
            </div>
          </div>
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
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
              <div className="mb-6">
                <Loader size={36} text="Generating your tickets..." />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Almost there!</h2>
              <p className="text-gray-600">Please wait while we prepare your digital tickets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                  <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={customer.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={customer.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email address"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">We'll email your tickets to this address</p>
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={customer.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                        <Tabs defaultValue="CARD" className="w-full" onValueChange={handleTabChange}>
                          <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="CARD">Card</TabsTrigger>
                            <TabsTrigger value="KHALTI">Khalti</TabsTrigger>
                            <TabsTrigger value="ESEWA">eSewa</TabsTrigger>
                            <TabsTrigger value="FONEPAY">FonePay</TabsTrigger>
                            <TabsTrigger value="CONNECTIPS">ConnectIPS</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="CARD" className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentInfoChange}
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentInfoChange}
                                  placeholder="MM/YY"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                  id="cvc"
                                  name="cvc"
                                  value={paymentInfo.cvc}
                                  onChange={handlePaymentInfoChange}
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="KHALTI" className="pt-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="mb-3">Continue to pay with Khalti</p>
                              <img 
                                src="https://seeklogo.com/images/K/khalti-logo-F0B049E68F-seeklogo.com.png" 
                                alt="Khalti Logo" 
                                className="h-8 mx-auto mb-3"
                                loading="lazy"
                              />
                              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Phone className="h-4 w-4" />
                                <span>9749377349</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="ESEWA" className="pt-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="mb-3">Continue to pay with eSewa</p>
                              <img 
                                src="https://esewa.com.np/common/images/esewa_logo.png" 
                                alt="eSewa Logo" 
                                className="h-8 mx-auto mb-3"
                                loading="lazy"
                              />
                              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Phone className="h-4 w-4" />
                                <span>9749377349</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="FONEPAY" className="pt-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="mb-3">Continue to pay with FonePay</p>
                              <img 
                                src="https://fonepay.com/images/logo.png" 
                                alt="FonePay Logo" 
                                className="h-8 mx-auto mb-3"
                                loading="lazy"
                              />
                              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Phone className="h-4 w-4" />
                                <span>9749377349</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="CONNECTIPS" className="pt-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="mb-3">Continue to pay with ConnectIPS</p>
                              <img 
                                src="https://connectips.com/images/connectips.png" 
                                alt="ConnectIPS Logo" 
                                className="h-8 mx-auto mb-3"
                                loading="lazy"
                              />
                              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <Phone className="h-4 w-4" />
                                <span>9749377349</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
                            </div>
                          </TabsContent>
                        </Tabs>
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
                          <>Processing...</>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay {formatPrice(event.price * quantity * 1.05)}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="md:col-span-2">
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
