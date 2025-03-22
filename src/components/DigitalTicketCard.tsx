
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DigitalTicket, Event, TicketType } from "@/types";
import { dbService } from "@/lib/dbService";
import { Download, Calendar, MapPin, Users, CheckCircle2, ShieldCheck, ArrowUpCircle } from "lucide-react";
import html2canvas from "html2canvas";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import TicketUpgradeModal from "./TicketUpgradeModal";

interface DigitalTicketCardProps {
  ticket: DigitalTicket;
}

const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>(ticket.ticketType);
  const ticketRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await dbService.getEventById(ticket.eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [ticket.eventId]);

  const handleDownload = async () => {
    if (ticketRef.current && event) {
      try {
        setDownloading(true);
        
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#FFFFFF",
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `nepal-tix-${event.title.replace(/\s+/g, '-').toLowerCase()}-ticket.png`;
        link.click();
        
        toast.success("Ticket downloaded successfully");
      } catch (error) {
        console.error("Error generating ticket:", error);
        toast.error("Failed to download ticket");
      } finally {
        setDownloading(false);
      }
    }
  };

  const handleUpgradeComplete = (newTicketType: TicketType) => {
    setTicketType(newTicketType);
  };

  const getTicketTypeClass = () => {
    switch (ticketType) {
      case TicketType.VIP:
        return "bg-amber-500";
      case TicketType.EARLY_BIRD:
        return "bg-blue-500";
      default:
        return "bg-nepal-red";
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
        <CardHeader className="bg-nepal-red/90 p-4">
          <Skeleton className="h-6 w-3/4 bg-white/20" />
          <Skeleton className="h-4 w-1/3 mt-2 bg-white/20" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex justify-center py-4">
            <Skeleton className="h-32 w-32 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!event) return null;

  // Check if the event has already happened
  const eventHasPassed = new Date(event.date) < new Date();

  return (
    <>
      <Card className="overflow-hidden border-2 border-nepal-red/10 transition-all hover:shadow-xl rounded-lg animate-fade-in bg-white">
        <div ref={ticketRef} className="relative bg-white">
          <div className={`absolute top-0 right-0 ${getTicketTypeClass()} text-white rounded-bl-xl py-1 px-3 text-sm font-medium z-10`}>
            {ticketType}
          </div>
          
          <CardHeader className="bg-gradient-to-r from-nepal-red to-nepal-red/80 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-nepal-pattern"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-2xl font-bold font-serif">{event.title}</h3>
                <p className="text-white/90 mt-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {event.time}</p>
              </div>
              <div className="bg-white text-nepal-red rounded-full p-2 w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">
                {ticket.quantity}x
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-nepal-red" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}, {event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-nepal-red" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-nepal-red" />
                  <span>Quantity: {ticket.quantity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-dashed border-gray-200">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Access Code</p>
                  <div className="font-mono bg-gray-50 p-3 rounded-md border border-gray-100 text-center inline-block min-w-48">
                    {ticket.accessCode}
                  </div>
                  
                  <div className="my-6 relative">
                    <div className="absolute -left-2 -top-1/2 transform translate-y-1/2 w-4 h-8 bg-gray-100 rounded-r-full"></div>
                    <div className="absolute -right-2 -top-1/2 transform translate-y-1/2 w-4 h-8 bg-gray-100 rounded-l-full"></div>
                    
                    <p className="text-sm font-medium text-gray-600 mb-2">Scan QR Code</p>
                    <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm inline-block">
                      <img 
                        src={ticket.qrCode} 
                        alt="QR Code" 
                        className="h-32 w-32 object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Barcode</p>
                    <div className="bg-white p-3 border border-gray-200 rounded-md inline-block">
                      {/* Barcode representation */}
                      <div className="flex items-end justify-center space-x-0.5 h-12 min-w-48">
                        {ticket.barcode.split('').map((digit, index) => (
                          <div 
                            key={index}
                            className="bg-gray-900"
                            style={{ 
                              height: `${Math.max(30, parseInt(digit) * 5 + 30)}%`,
                              width: parseInt(digit) % 2 === 0 ? '1px' : '2px'
                            }}
                          />
                        ))}
                      </div>
                      <p className="mt-2 font-mono text-xs">{ticket.barcode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-gray-100 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-600" />
              <p className="text-xs text-gray-500">Secured with blockchain</p>
            </div>
            <p className="text-xs text-gray-500">ID: {ticket.id.slice(-8)}</p>
          </CardFooter>
        </div>
        
        <CardFooter className="bg-gray-50 p-4 gap-2">
          <Button 
            onClick={handleDownload} 
            variant="default"
            className="w-full flex items-center gap-2 bg-nepal-red hover:bg-nepal-red/90"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader size={16} className="text-white" />
                Generating Ticket...
              </>
            ) : (
              <>
                <Download size={16} />
                Download Ticket
              </>
            )}
          </Button>
          
          {!eventHasPassed && ticketType !== TicketType.VIP && (
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-2 text-nepal-red border-nepal-red/30 hover:bg-nepal-red/5"
              onClick={() => setShowUpgradeModal(true)}
            >
              <ArrowUpCircle size={16} />
              Upgrade
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <TicketUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTicketType={ticketType}
        ticketId={ticket.id}
        eventId={ticket.eventId}
        event={event}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </>
  );
};

export default DigitalTicketCard;
