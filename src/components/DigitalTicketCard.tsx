import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DigitalTicket, Event, TicketType } from "@/types";
import { dbService } from "@/lib/dbService";
import { Download, Calendar, MapPin, Users, CheckCircle2, ShieldCheck, ArrowUpCircle, Printer } from "lucide-react";
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
  const [printing, setPrinting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [ticketType, setTicketType] = useState<TicketType>(ticket.ticketType);
  const ticketRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = async () => {
    if (ticketRef.current && event) {
      try {
        setPrinting(true);
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error("Pop-up blocked. Please allow pop-ups to print tickets.");
          return;
        }
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Ticket - ${event.title}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  color: #000;
                }
                .ticket-container {
                  border: 2px solid #d1d5db;
                  border-radius: 8px;
                  overflow: hidden;
                  max-width: 600px;
                  margin: 0 auto;
                  page-break-inside: avoid;
                }
                .ticket-header {
                  background: linear-gradient(to right, #e11d48, #f43f5e);
                  color: white;
                  padding: 16px;
                  position: relative;
                }
                .ticket-content {
                  padding: 20px;
                  background: #fff;
                }
                .ticket-footer {
                  display: flex;
                  justify-content: space-between;
                  padding: 10px 16px;
                  border-top: 1px solid #e5e7eb;
                  background: #f9fafb;
                  font-size: 12px;
                  color: #6b7280;
                }
                .ticket-badge {
                  background: #e11d48;
                  color: white;
                  padding: 4px 12px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  font-weight: 500;
                  font-size: 14px;
                  border-bottom-left-radius: 8px;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                  margin-bottom: 20px;
                }
                .divider {
                  border-top: 1px dashed #d1d5db;
                  margin: 20px 0;
                  position: relative;
                }
                .divider:before,
                .divider:after {
                  content: '';
                  height: 20px;
                  width: 20px;
                  background: #f9fafb;
                  border: 1px solid #d1d5db;
                  border-radius: 50%;
                  position: absolute;
                  top: -10px;
                }
                .divider:before {
                  left: -10px;
                }
                .divider:after {
                  right: -10px;
                }
                .qr-container {
                  text-align: center;
                  margin: 20px 0;
                }
                .barcode-container {
                  text-align: center;
                  margin-top: 20px;
                }
                .access-code {
                  font-family: monospace;
                  font-size: 18px;
                  background: #f3f4f6;
                  padding: 8px;
                  text-align: center;
                  border-radius: 4px;
                  letter-spacing: 2px;
                  border: 1px solid #d1d5db;
                }
                .info-item {
                  margin: 8px 0;
                }
                .info-label {
                  font-weight: bold;
                  font-size: 12px;
                  color: #6b7280;
                  margin-bottom: 2px;
                }
                @media print {
                  .ticket-container {
                    border-color: #000;
                  }
                  .ticket-header {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    background-color: #e11d48 !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="ticket-container">
                <div class="ticket-header">
                  <div class="ticket-badge">${ticketType}</div>
                  <h1 style="margin-top: 0; margin-bottom: 4px;">${event.title}</h1>
                  <p style="margin-top: 4px;">${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · ${event.time}</p>
                </div>
                <div class="ticket-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Date & Time</div>
                      <div>${new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}, ${event.time}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Location</div>
                      <div>${event.location}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Quantity</div>
                      <div>${ticket.quantity}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Ticket Type</div>
                      <div>${ticketType}</div>
                    </div>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <div style="text-align: center;">
                    <div class="info-label">Access Code</div>
                    <div class="access-code">${ticket.accessCode}</div>
                  </div>
                  
                  <div class="qr-container">
                    <div class="info-label">Scan QR Code</div>
                    <img src="${ticket.qrCode}" alt="QR Code" style="height: 150px; width: 150px; object-fit: contain;">
                  </div>
                  
                  <div class="barcode-container">
                    <div class="info-label">Barcode</div>
                    <div style="margin-top: 10px;">
                      <div style="display: flex; justify-content: center; gap: 1px; height: 50px;">
                        ${ticket.barcode.split('').map(digit => `
                          <div 
                            style="background: #000; height: ${Math.max(30, parseInt(digit) * 5 + 30)}%; width: ${parseInt(digit) % 2 === 0 ? '1px' : '2px'};"
                          ></div>
                        `).join('')}
                      </div>
                      <div style="font-family: monospace; font-size: 12px; margin-top: 5px;">${ticket.barcode}</div>
                    </div>
                  </div>
                </div>
                <div class="ticket-footer">
                  <div>Secured with blockchain</div>
                  <div>ID: ${ticket.id.slice(-8)}</div>
                </div>
              </div>
              <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280;">
                This ticket is powered by NepalTix
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        toast.success("Printing ticket...");
      } catch (error) {
        console.error("Error printing ticket:", error);
        toast.error("Failed to print ticket");
      } finally {
        setPrinting(false);
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

  const eventHasPassed = new Date(event.date) < new Date();

  return (
    <>
      <Card className="overflow-hidden border-2 border-nepal-red/10 transition-all hover:shadow-xl rounded-lg animate-fade-in bg-white">
        <div ref={ticketRef} className="relative bg-white">
          <div className={`absolute top-0 right-0 ${getTicketTypeClass()} text-white rounded-bl-xl py-1 px-3 text-xs font-medium z-10`}>
            {ticketType}
          </div>

          {/* Compact real-ticket layout */}
          <div className="flex">
            {/* Main panel */}
            <div className="flex-1 p-4">
              {/* Brand / logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-nepal-red text-white flex items-center justify-center font-bold">NT</div>
                <div className="leading-tight">
                  <p className="text-xs text-gray-500">Digital Ticket</p>
                  <p className="font-serif font-bold text-lg">NepalTix</p>
                </div>
              </div>

              {/* Event title */}
              <h3 className="text-base sm:text-lg font-semibold mb-1">{event.title}</h3>
              <p className="text-xs text-gray-600 mb-3">
                {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })} · {event.time}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-nepal-red" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-nepal-red" />
                  <span className="truncate" title={event.location}>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-nepal-red" />
                  <span>Qty: {ticket.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span className="text-green-600">Verified</span>
                </div>
              </div>

              {/* Access code */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Access Code</p>
                <div className="font-mono text-sm bg-gray-50 px-3 py-2 rounded border border-gray-100 inline-block">
                  {ticket.accessCode}
                </div>
              </div>
            </div>

            {/* Stub */}
            <div className="relative w-40 sm:w-48 bg-gray-50 p-3 border-l border-dashed border-gray-300 flex flex-col items-center">
              {/* Perforation notches */}
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-gray-200"></span>

              {/* Quantity bubble on small screens */}
              <div className="bg-white text-nepal-red rounded-full px-2 py-1 text-xs font-bold shadow mb-2">{ticket.quantity}x</div>

              {/* QR */}
              <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
                <img src={ticket.qrCode} alt="Ticket QR code" className="h-20 w-20 object-contain" />
              </div>

              {/* Barcode small */}
              <div className="mt-3 bg-white p-2 border border-gray-200 rounded-md w-full">
                <div className="flex items-end justify-center gap-px h-10">
                  {ticket.barcode.split('').map((digit, index) => (
                    <div
                      key={index}
                      className="bg-gray-900"
                      style={{ height: `${Math.max(30, parseInt(digit) * 5 + 30)}%`, width: parseInt(digit) % 2 === 0 ? '1px' : '2px' }}
                    />
                  ))}
                </div>
                <p className="mt-1 font-mono text-[10px] text-center tracking-wider">{ticket.barcode}</p>
              </div>

              {/* ID */}
              <p className="mt-2 text-[10px] text-gray-500">ID: {ticket.id.slice(-8)}</p>
            </div>
          </div>
        </div>

        <CardFooter className="bg-gray-50 p-3 gap-2">
          <Button 
            onClick={handleDownload} 
            variant="default"
            className="flex-1 flex items-center gap-2 bg-nepal-red hover:bg-nepal-red/90"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader size={16} className="text-white" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Download
              </>
            )}
          </Button>

          <Button 
            onClick={handlePrint} 
            variant="outline"
            className="flex-1 flex items-center gap-2 border-nepal-red/30 text-nepal-red hover:bg-nepal-red/5"
            disabled={printing}
          >
            {printing ? (
              <>
                <Loader size={16} />
                Printing...
              </>
            ) : (
              <>
                <Printer size={16} />
                Print
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
        ticketId={ticket.id}
        eventId={ticket.eventId}
        event={event}
        ticket={{
          id: ticket.id,
          customerId: ticket.customerId,
          ticketType: ticketType
        }}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </>
  );
};

export default DigitalTicketCard;
