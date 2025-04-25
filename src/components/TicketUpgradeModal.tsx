
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TicketType, NotificationType, Event } from '@/types';
import { getTicketTypeLabel } from '@/lib/utils';
import { dbService } from '@/lib/dbService';
import { toast } from "sonner";

interface TicketUpgradeModalProps {
  ticket?: {
    id: string;
    customerId: string;
    ticketType: TicketType;
  };
  ticketId: string;
  eventId: string;
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onUpgradeComplete: (newType: TicketType) => void;
}

const TicketUpgradeModal = ({ 
  ticket, 
  ticketId, 
  eventId, 
  event, 
  isOpen, 
  onClose, 
  onUpgradeComplete 
}: TicketUpgradeModalProps) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine the current ticket type to know which options to show
  const currentTicketType = ticket?.ticketType || TicketType.STANDARD;

  // Filter options to exclude the current ticket type
  const upgradeOptions = Object.values(TicketType).filter(
    type => type !== currentTicketType
  );
  
  const getUpgradePrice = () => {
    // Base price from event
    const basePrice = event?.price || 0;
    
    switch (selectedUpgrade) {
      case TicketType.VIP:
        return basePrice * 2.5; // VIP tickets cost 2.5x more
      case TicketType.FAN_ZONE:
        return basePrice * 1.5; // Fan Zone tickets cost 1.5x more
      case TicketType.EARLY_BIRD:
        return basePrice * 0.8; // Early Bird tickets cost 20% less
      default:
        return basePrice;
    }
  };

  const handleUpgrade = async () => {
    if (!selectedUpgrade) return;
    
    setIsLoading(true);
    
    try {
      // Update ticket type in database
      const result = await dbService.updateTicket(
        ticketId,
        { ticketType: selectedUpgrade }
      );
      
      if (!result) {
        throw new Error('Failed to upgrade ticket');
      }
      
      // Add notification about the upgrade
      const customerId = ticket?.customerId || '';
      await dbService.addNotification(
        'Ticket Upgraded Successfully',
        `Your ticket has been upgraded to ${getTicketTypeLabel(selectedUpgrade)}!`,
        NotificationType.SUCCESS,
        customerId
      );
      
      // Show success toast notification
      toast.success("Ticket Upgraded!", {
        description: "Your ticket has been successfully upgraded."
      });
      
      // Call the onUpgrade callback
      onUpgradeComplete(selectedUpgrade);
      
      // Close the modal
      onClose();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upgrade failed';
      console.error("Error upgrading ticket:", error);
      
      // Show error toast notification
      toast.error("Upgrade Failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade Your Ticket</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a new ticket type to enhance your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Upgrade Options</h4>
            <RadioGroup defaultValue={selectedUpgrade || ''} onValueChange={(value) => setSelectedUpgrade(value as TicketType)}>
              {upgradeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{getTicketTypeLabel(option)} - NPR {getUpgradePrice()}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading || !selectedUpgrade} onClick={handleUpgrade}>
            {isLoading ? "Upgrading..." : "Upgrade Ticket"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketUpgradeModal;
