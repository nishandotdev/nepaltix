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
        link.download = `ticketnepal-${event.title.replace(/\s+/g, '-').toLowerCase()}-ticket.png`;
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
                * { box-sizing: border-box; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: #f3f4f6;
                }
                .ticket-container {
                  max-width: 600px;
                  margin: 0 auto;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  background: white;
                }
                .ticket-header {
                  background: linear-gradient(135deg, #e11d48 0%, #dc2626 50%, #f43f5e 100%);
                  color: white;
                  padding: 32px 24px;
                  position: relative;
                }
                .ticket-header::before,
                .ticket-header::after {
                  content: '';
                  position: absolute;
                  background: rgba(255,255,255,0.1);
                  border-radius: 50%;
                }
                .ticket-header::before {
                  width: 250px;
                  height: 250px;
                  top: -125px;
                  right: -125px;
                }
                .ticket-header::after {
                  width: 180px;
                  height: 180px;
                  bottom: -90px;
                  left: -90px;
                }
                .badge {
                  display: inline-block;
                  background: rgba(255,255,255,0.2);
                  backdrop-filter: blur(10px);
                  padding: 6px 16px;
                  border-radius: 999px;
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  border: 1px solid rgba(255,255,255,0.3);
                  position: absolute;
                  top: 16px;
                  right: 16px;
                }
                .brand {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-bottom: 24px;
                  position: relative;
                  z-index: 1;
                }
                .logo {
                  width: 48px;
                  height: 48px;
                  background: white;
                  color: #e11d48;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 900;
                  font-size: 20px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .brand-text {
                  position: relative;
                  z-index: 1;
                }
                .brand-label {
                  font-size: 10px;
                  opacity: 0.9;
                  font-weight: 500;
                  letter-spacing: 1px;
                }
                .brand-name {
                  font-size: 20px;
                  font-weight: 700;
                  font-family: Georgia, serif;
                }
                .event-info {
                  position: relative;
                  z-index: 1;
                }
                .event-title {
                  font-size: 28px;
                  font-weight: 700;
                  margin: 0 0 16px 0;
                  line-height: 1.2;
                }
                .event-detail {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  background: rgba(255,255,255,0.1);
                  backdrop-filter: blur(8px);
                  padding: 10px 12px;
                  border-radius: 8px;
                  font-size: 13px;
                  margin-bottom: 8px;
                  border: 1px solid rgba(255,255,255,0.2);
                }
                .tear-line {
                  display: flex;
                  justify-content: center;
                  gap: 8px;
                  margin: -12px 0 24px 0;
                }
                .tear-dot {
                  width: 12px;
                  height: 12px;
                  background: #f3f4f6;
                  border: 2px solid #e5e7eb;
                  border-radius: 50%;
                }
                .ticket-body {
                  padding: 24px;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 16px;
                  margin-bottom: 24px;
                }
                .info-card {
                  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                  padding: 16px;
                  border-radius: 12px;
                  border: 1px solid #e5e7eb;
                }
                .info-label {
                  font-size: 10px;
                  color: #6b7280;
                  font-weight: 600;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  margin-bottom: 6px;
                }
                .info-value {
                  font-size: 24px;
                  font-weight: 700;
                  color: #e11d48;
                }
                .access-section {
                  background: linear-gradient(135deg, rgba(225,29,72,0.05) 0%, rgba(244,63,94,0.05) 100%);
                  padding: 20px;
                  border-radius: 12px;
                  border: 1px solid rgba(225,29,72,0.2);
                  margin-bottom: 24px;
                  text-align: center;
                }
                .access-label {
                  font-size: 11px;
                  color: #6b7280;
                  font-weight: 600;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  margin-bottom: 8px;
                }
                .access-code {
                  font-family: 'Courier New', monospace;
                  font-size: 32px;
                  font-weight: 700;
                  color: #e11d48;
                  letter-spacing: 4px;
                }
                .scan-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 16px;
                }
                .scan-card {
                  background: white;
                  border: 2px solid #e5e7eb;
                  border-radius: 12px;
                  padding: 16px;
                  text-align: center;
                }
                .scan-label {
                  font-size: 10px;
                  color: #6b7280;
                  font-weight: 600;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  margin-bottom: 12px;
                }
                .qr-code {
                  width: 110px;
                  height: 110px;
                  margin: 0 auto;
                }
                .barcode-visual {
                  display: flex;
                  align-items: flex-end;
                  justify-content: center;
                  gap: 1px;
                  height: 64px;
                  margin-bottom: 8px;
                }
                .bar {
                  background: #111827;
                  border-radius: 2px 2px 0 0;
                }
                .barcode-text {
                  font-family: 'Courier New', monospace;
                  font-size: 10px;
                  letter-spacing: 2px;
                  color: #6b7280;
                }
                .footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 16px 24px;
                  border-top: 1px solid #e5e7eb;
                  background: #f9fafb;
                  font-size: 11px;
                  color: #6b7280;
                }
                @media print {
                  body { background: white; padding: 0; }
                  .ticket-container { box-shadow: none; }
                  .ticket-header {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              <div class="ticket-container">
                <div class="ticket-header">
                  <div class="badge">${ticketType}</div>
                  <div class="brand">
                    <div class="logo">TN</div>
                    <div class="brand-text">
                      <div class="brand-label">DIGITAL TICKET</div>
                      <div class="brand-name">TicketNepal</div>
                    </div>
                  </div>
                  <div class="event-info">
                    <h1 class="event-title">${event.title}</h1>
                    <div class="event-detail">
                      📅 ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div class="event-detail">
                      📍 ${event.location}
                    </div>
                  </div>
                </div>
                
                <div class="tear-line">
                  ${[...Array(12)].map(() => '<div class="tear-dot"></div>').join('')}
                </div>
                
                <div class="ticket-body">
                  <div class="info-grid">
                    <div class="info-card">
                      <div class="info-label">👥 Quantity</div>
                      <div class="info-value">${ticket.quantity}</div>
                    </div>
                    <div class="info-card">
                      <div class="info-label">✓ Status</div>
                      <div class="info-value" style="color: #10b981; font-size: 14px;">Verified</div>
                    </div>
                  </div>
                  
                  <div class="access-section">
                    <div class="access-label">Access Code</div>
                    <div class="access-code">${ticket.accessCode}</div>
                  </div>
                  
                  <div class="scan-grid">
                    <div class="scan-card">
                      <div class="scan-label">QR Code</div>
                      <img src="${ticket.qrCode}" alt="QR" class="qr-code">
                    </div>
                    <div class="scan-card">
                      <div class="scan-label">Barcode</div>
                      <div class="barcode-visual">
                        ${ticket.barcode.split('').map(digit => `
                          <div class="bar" style="height: ${Math.max(40, parseInt(digit) * 6 + 40)}%; width: ${parseInt(digit) % 2 === 0 ? '2px' : '3px'};"></div>
                        `).join('')}
                      </div>
                      <div class="barcode-text">${ticket.barcode}</div>
                    </div>
                  </div>
                </div>
                
                <div class="footer">
                  <div>🔒 Blockchain Secured</div>
                  <div>ID: ${ticket.id.slice(-8).toUpperCase()}</div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() { window.print(); }, 500);
                  setTimeout(function() { window.close(); }, 1000);
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
      <Card className="overflow-hidden border-2 border-gray-200 transition-all hover:shadow-2xl rounded-2xl animate-fade-in bg-gradient-to-br from-white to-gray-50">
        <div ref={ticketRef} className="relative bg-gradient-to-br from-nepal-red via-red-600 to-rose-700">
          {/* Modern gradient header with geometric pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
          </div>
          
          <div className="relative p-6 text-white">
            {/* Premium badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/30">
              {ticketType}
            </div>
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white text-nepal-red flex items-center justify-center font-black text-xl shadow-lg">
                TN
              </div>
              <div>
                <p className="text-xs font-medium opacity-90">DIGITAL TICKET</p>
                <p className="font-serif font-bold text-xl">TicketNepal</p>
              </div>
            </div>
            
            {/* Event Info */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <Calendar size={16} />
                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          
          {/* Ticket details section with modern card design */}
          <div className="bg-white p-6 relative">
            {/* Decorative tear line */}
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <div className="flex gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gray-100 rounded-full border-2 border-gray-200" />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Users size={14} />
                  QUANTITY
                </p>
                <p className="text-2xl font-bold text-nepal-red">{ticket.quantity}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  STATUS
                </p>
                <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Verified
                </p>
              </div>
            </div>
            
            {/* Access code in modern style */}
            <div className="bg-gradient-to-r from-nepal-red/5 to-rose-100/30 p-4 rounded-xl border border-nepal-red/20 mb-6">
              <p className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">Access Code</p>
              <p className="font-mono text-2xl font-bold text-nepal-red tracking-wider">{ticket.accessCode}</p>
            </div>
            
            {/* QR and Barcode section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">QR CODE</p>
                <img src={ticket.qrCode} alt="QR" className="w-28 h-28 object-contain" />
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500 mb-3 font-medium">BARCODE</p>
                <div className="flex items-end justify-center gap-px h-16 w-full">
                  {ticket.barcode.split('').map((digit, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 rounded-t"
                      style={{ height: `${Math.max(40, parseInt(digit) * 6 + 40)}%`, width: parseInt(digit) % 2 === 0 ? '2px' : '3px' }}
                    />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[10px] tracking-widest text-gray-600">{ticket.barcode}</p>
              </div>
            </div>
            
            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} />
                Blockchain Secured
              </span>
              <span>ID: {ticket.id.slice(-8).toUpperCase()}</span>
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
