
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Crown, Users, Clock, ShieldCheck } from "lucide-react";
import { TicketType, Event } from "@/types";
import { dbService } from "@/lib/dbService";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface TicketTypeOption {
  type: TicketType;
  title: string;
  description: string;
  priceMultiplier: number;
  icon: React.ReactNode;
  benefits: string[];
}

interface TicketUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTicketType: TicketType;
  ticketId: string;
  eventId: string;
  event: Event | null;
  onUpgradeComplete: (newTicketType: TicketType) => void;
}

const TicketUpgradeModal: React.FC<TicketUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTicketType,
  ticketId,
  eventId,
  event,
  onUpgradeComplete,
}) => {
  const [selectedType, setSelectedType] = useState<TicketType | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const ticketTypes: TicketTypeOption[] = [
    {
      type: TicketType.STANDARD,
      title: "Standard",
      description: "Basic admission to the event",
      priceMultiplier: 1,
      icon: <Users size={20} className="text-gray-600" />,
      benefits: ["Standard seating", "Basic amenities", "General entrance"],
    },
    {
      type: TicketType.VIP,
      title: "VIP",
      description: "Premium experience with exclusive benefits",
      priceMultiplier: 2,
      icon: <Crown size={20} className="text-amber-500" />,
      benefits: [
        "Priority seating",
        "Exclusive lounge access",
        "Complimentary refreshments",
        "Special gift bag",
      ],
    },
    {
      type: TicketType.EARLY_BIRD,
      title: "Early Bird",
      description: "Discounted rate for early bookings",
      priceMultiplier: 0.8,
      icon: <Clock size={20} className="text-blue-500" />,
      benefits: [
        "Standard seating",
        "Discounted price",
        "Early entry (30 mins)",
      ],
    },
  ];

  const handleUpgrade = async () => {
    if (!selectedType || selectedType === currentTicketType || !event) {
      return;
    }

    setIsUpgrading(true);

    try {
      // In a real app, this would handle the payment process first
      
      // Get the current ticket
      const ticket = await dbService.getTicketById(ticketId);
      
      if (!ticket) {
        toast.error("Ticket not found");
        setIsUpgrading(false);
        return;
      }
      
      // Update the ticket type
      const updatedTicket = {
        ...ticket,
        ticketType: selectedType,
      };
      
      const success = await dbService.updateTicket(updatedTicket);
      
      if (success) {
        toast.success(`Ticket upgraded to ${selectedType} successfully!`);
        onUpgradeComplete(selectedType);
        onClose();
      } else {
        toast.error("Failed to upgrade ticket");
      }
    } catch (error) {
      console.error("Error upgrading ticket:", error);
      toast.error("An error occurred while upgrading your ticket");
    } finally {
      setIsUpgrading(false);
    }
  };

  // Don't show types that are lower than current (can't downgrade)
  const getEligibleUpgrades = () => {
    if (currentTicketType === TicketType.STANDARD) {
      return ticketTypes.filter(t => t.type !== TicketType.EARLY_BIRD);
    } else if (currentTicketType === TicketType.EARLY_BIRD) {
      return ticketTypes.filter(t => t.type !== TicketType.EARLY_BIRD);
    } else {
      return ticketTypes.filter(t => t.type === TicketType.VIP);
    }
  };

  const eligibleTypes = getEligibleUpgrades();
  
  const calculatePrice = (type: TicketType) => {
    if (!event) return 0;
    const option = ticketTypes.find(t => t.type === type);
    return option ? Math.round(event.price * option.priceMultiplier) : event.price;
  };
  
  const calculateUpgradeCost = () => {
    if (!selectedType || !event) return 0;
    const currentPrice = calculatePrice(currentTicketType);
    const newPrice = calculatePrice(selectedType);
    return Math.max(0, newPrice - currentPrice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upgrade Your Ticket</DialogTitle>
          <DialogDescription>
            Select a new ticket type to enhance your experience
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup 
            value={selectedType || undefined} 
            onValueChange={(value) => setSelectedType(value as TicketType)}
            className="space-y-3"
          >
            {eligibleTypes.map((option) => (
              <div
                key={option.type}
                className={`relative flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors ${
                  option.type === currentTicketType
                    ? "bg-gray-100 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <RadioGroupItem 
                  value={option.type} 
                  id={option.type}
                  disabled={option.type === currentTicketType}
                  className="mt-1"
                />
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <Label 
                      htmlFor={option.type} 
                      className={`text-base font-medium flex items-center gap-2 ${
                        option.type === currentTicketType ? "text-gray-500" : ""
                      }`}
                    >
                      {option.icon} {option.title}
                      {option.type === currentTicketType && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 ml-2">
                          Current
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                    <ul className="mt-1 space-y-1">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <Check size={12} className="mr-1 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm font-medium">
                    {event && (
                      <div className="text-right">
                        <span className="text-gray-900 font-bold">
                          NPR {calculatePrice(option.type)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {selectedType && selectedType !== currentTicketType && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between text-sm">
                <span>Current ticket price:</span>
                <span>NPR {calculatePrice(currentTicketType)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New ticket price:</span>
                <span>NPR {calculatePrice(selectedType)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-gray-200 mt-2 pt-2">
                <span>Upgrade cost:</span>
                <span className="text-nepal-red">
                  NPR {calculateUpgradeCost()}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <ShieldCheck size={14} className="mr-1" />
            Secure payment process
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleUpgrade}
              disabled={!selectedType || selectedType === currentTicketType || isUpgrading}
              className="bg-nepal-red hover:bg-nepal-red/90"
            >
              {isUpgrading ? (
                <>
                  <Loader size={16} className="mr-2 text-white" />
                  Processing...
                </>
              ) : (
                "Upgrade Ticket"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketUpgradeModal;
