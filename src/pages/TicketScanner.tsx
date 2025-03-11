
import { useState } from 'react';
import { Check, X, QrCode, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { events } from '@/data/events';

const TicketScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<{
    id: string;
    event: string;
    customer: string;
    quantity: number;
  } | null>(null);
  
  const { toast } = useToast();
  
  const handleScan = () => {
    // Simulate scanning a QR code
    const scanning = setTimeout(() => {
      // Random validation (80% valid, 20% invalid)
      const valid = Math.random() > 0.2;
      setIsValid(valid);
      
      if (valid) {
        // Choose a random event
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        // Generate a random ticket ID
        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        // Generate a random customer name
        const names = ['John Doe', 'Jane Smith', 'Ram Sharma', 'Sita Rai', 'Anish Gurung'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        setTicketInfo({
          id: `TKT-${randomId}`,
          event: randomEvent.title,
          customer: randomName,
          quantity: Math.floor(Math.random() * 3) + 1
        });
        
        toast({
          title: "Valid Ticket",
          description: `Ticket for ${randomEvent.title} is valid.`,
          variant: "default"
        });
      } else {
        setTicketInfo(null);
        
        toast({
          title: "Invalid Ticket",
          description: "This ticket is invalid or has already been used.",
          variant: "destructive"
        });
      }
      
      setScanned(true);
    }, 1500);
    
    return () => clearTimeout(scanning);
  };
  
  const resetScanner = () => {
    setScanned(false);
    setTicketInfo(null);
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Ticket Scanner
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Scan digital tickets to validate entry
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            {scanned ? (
              <div className="text-center">
                <div className={`mx-auto rounded-full h-20 w-20 flex items-center justify-center mb-6 ${
                  isValid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {isValid ? (
                    <Check className="h-10 w-10" />
                  ) : (
                    <X className="h-10 w-10" />
                  )}
                </div>
                
                <h2 className="text-2xl font-semibold mb-2">
                  {isValid ? 'Valid Ticket' : 'Invalid Ticket'}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {isValid 
                    ? 'This ticket is valid for entry' 
                    : 'This ticket is invalid or has already been used'}
                </p>
                
                {isValid && ticketInfo && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left mb-6">
                    <p className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400">Ticket ID:</span>
                      <span className="font-medium">{ticketInfo.id}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400">Event:</span>
                      <span className="font-medium">{ticketInfo.event}</span>
                    </p>
                    <p className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                      <span className="font-medium">{ticketInfo.customer}</span>
                    </p>
                    <p className="flex justify-between py-1">
                      <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                      <span className="font-medium">{ticketInfo.quantity}</span>
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={resetScanner}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan Another Ticket
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-56 mx-auto mb-6 flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-gray-400" />
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Position the QR code within the scanner frame
                </p>
                
                <Button 
                  className="w-full bg-nepal-red hover:bg-nepal-red/90"
                  onClick={handleScan}
                >
                  Start Scanning
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  In a real app, this would activate your device's camera
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default TicketScanner;
