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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TicketType, NotificationType } from '@/types';
import { getTicketTypeLabel } from '@/lib/utils';
import { dbService } from '@/lib/dbService';
import { ticketService } from '@/lib/ticketService';
import { paymentService } from '@/lib/paymentService';
import { toast } from "sonner";

interface TicketUpgradeModalProps {
  ticket: {
    id: string;
    customerId: string;
    ticketType: TicketType;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (newType: TicketType) => void;
}

const TicketUpgradeModal = ({ ticket, isOpen, onClose, onUpgrade }: TicketUpgradeModalProps) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const upgradeOptions = Object.values(TicketType).filter(
    type => type !== ticket.ticketType
  );
  
  const getUpgradePrice = () => {
    // Mock prices, replace with actual logic
    switch (selectedUpgrade) {
      case TicketType.VIP:
        return 500;
      case TicketType.FAN_ZONE:
        return 300;
      case TicketType.EARLY_BIRD:
        return 100;
      default:
        return 0;
    }
  };

  const handleUpgrade = async () => {
    if (!selectedUpgrade) return;
    
    setIsLoading(true);
    
    try {
      // Process payment
      const paymentResult = await paymentService.processPayment({
        amount: getUpgradePrice(),
        currency: 'NPR',
        description: `Upgrade to ${selectedUpgrade} ticket`,
        customerId: ticket.customerId
      });
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment failed');
      }
      
      // Update ticket type
      const success = await ticketService.upgradeTicket(
        ticket.id,
        selectedUpgrade as TicketType
      );
      
      if (!success) {
        throw new Error('Failed to upgrade ticket');
      }
      
      // Add notification about the upgrade
      await dbService.addNotification(
        'Ticket Upgraded Successfully',
        `Your ticket has been upgraded to ${getTicketTypeLabel(selectedUpgrade as TicketType)}!`,
        NotificationType.SUCCESS,
        ticket.customerId
      );
      
      // Show success toast notification
      toast({
        title: "Ticket Upgraded!",
        description: "Your ticket has been successfully upgraded.",
        variant: "success",
      });
      
      // Call the onUpgrade callback
      onUpgrade(selectedUpgrade as TicketType);
      
      // Close the modal
      onClose();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upgrade failed';
      console.error("Error upgrading ticket:", error);
      
      // Show error toast notification
      toast({
        title: "Upgrade Failed",
        description: errorMessage,
        variant: "destructive",
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
          <AlertDialogAction disabled={isLoading} onClick={handleUpgrade}>
            {isLoading ? "Upgrading..." : "Upgrade Ticket"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketUpgradeModal;
