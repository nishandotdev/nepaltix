
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DigitalTicket } from "@/types";
import { dbService } from "@/lib/dbService";
import { Download, Calendar, MapPin, Users } from "lucide-react";
import html2canvas from "html2canvas";

interface DigitalTicketCardProps {
  ticket: DigitalTicket;
}

const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket }) => {
  const event = dbService.getEventById(ticket.eventId);
  const ticketRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `nepal-tix-${event?.title.replace(/\s+/g, '-').toLowerCase()}-ticket.png`;
        link.click();
      } catch (error) {
        console.error("Error generating ticket:", error);
      }
    }
  };

  if (!event) return null;

  return (
    <Card className="overflow-hidden border-2 border-nepal-red/20 transition-all hover:shadow-md">
      <div ref={ticketRef} className="relative bg-white">
        <div className="absolute top-0 right-0 bg-nepal-red/10 rounded-bl-xl p-2 text-nepal-red font-medium">
          {ticket.ticketType}
        </div>
        
        <CardHeader className="bg-nepal-red text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold font-serif">{event.title}</h3>
              <p className="text-white/80 text-sm">{event.date} · {event.time}</p>
            </div>
            <div className="bg-white text-nepal-red rounded-full p-1 w-10 h-10 flex items-center justify-center font-bold">
              {ticket.quantity}x
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-nepal-red" />
              <span>{event.date}, {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-nepal-red" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-nepal-red" />
              <span>Qty: {ticket.quantity}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <div className="text-center">
                <div className="font-mono bg-gray-100 p-2 rounded text-center">
                  {ticket.accessCode}
                </div>
                <img 
                  src={ticket.qrCode} 
                  alt="QR Code" 
                  className="mx-auto my-3 h-32 w-32"
                />
                <p className="text-xs text-gray-500">
                  Present this code at the venue entrance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-100 pt-4 pb-4">
          <div className="w-full flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-gray-500">Issued by</p>
              <p className="font-medium">NepalTix</p>
            </div>
            <p className="text-xs text-gray-500">ID: {ticket.id.slice(-8)}</p>
          </div>
        </CardFooter>
      </div>
      
      <CardFooter className="bg-gray-50 py-3">
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <Download size={16} />
          Download Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DigitalTicketCard;
