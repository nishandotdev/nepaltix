
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  MapPin,
  Users,
  User,
  Lock,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { DigitalTicket, Event, Customer } from '@/types';

interface TicketDisplayProps {
  ticketData: DigitalTicket;
  event: Event;
  customer: Customer;
  onDownload: () => void;
  onReturn: () => void;
}

const TicketDisplay = ({ ticketData, event, customer, onDownload, onReturn }: TicketDisplayProps) => {
  return (
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
          onClick={onDownload}
        >
          Download Ticket
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReturn}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default TicketDisplay;
