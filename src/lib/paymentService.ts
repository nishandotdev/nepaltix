
import { PaymentMethod, PaymentInfo } from '@/types';
import { toast } from "sonner";

class PaymentService {
  // Process payment using the specified payment method
  public async processPayment(
    amount: number,
    paymentInfo: PaymentInfo,
    onSuccess: () => void,
    onError: (message: string) => void
  ): Promise<void> {
    try {
      // Simulate a network request
      const processingDelay = Math.floor(Math.random() * 1000) + 1000; // 1-2 seconds
      
      await new Promise(resolve => setTimeout(resolve, processingDelay));
      
      // Different processing logic based on payment method
      switch (paymentInfo.paymentMethod) {
        case PaymentMethod.CARD:
          await this.processCardPayment(paymentInfo, amount);
          break;
        case PaymentMethod.ESEWA:
          await this.processEsewaPayment(paymentInfo, amount);
          break;
        case PaymentMethod.KHALTI:
          await this.processKhaltiPayment(paymentInfo, amount);
          break;
        case PaymentMethod.FONEPAY:
          await this.processFonepayPayment(paymentInfo, amount);
          break;
        case PaymentMethod.CONNECTIPS:
          await this.processConnectIpsPayment(paymentInfo, amount);
          break;
        default:
          throw new Error('Unsupported payment method');
      }
      
      // Simulate success (90% chance)
      if (Math.random() < 0.9) {
        onSuccess();
      } else {
        throw new Error('Payment declined by the payment provider');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
  
  // Process card payment
  private async processCardPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // Validate card details
    if (!this.validateCardNumber(paymentInfo.cardNumber)) {
      throw new Error('Invalid card number');
    }
    
    if (!this.validateExpiryDate(paymentInfo.expiryDate)) {
      throw new Error('Invalid expiry date');
    }
    
    if (!this.validateCVC(paymentInfo.cvc)) {
      throw new Error('Invalid CVC');
    }
    
    // In a real implementation, this would call a payment gateway API
    console.log(`Processing card payment of NPR ${amount}`);
  }
  
  // Process eSewa payment
  private async processEsewaPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In a real implementation, this would redirect to eSewa or call their API
    console.log(`Processing eSewa payment of NPR ${amount}`);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Process Khalti payment
  private async processKhaltiPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In a real implementation, this would redirect to Khalti or call their API
    console.log(`Processing Khalti payment of NPR ${amount}`);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Process FonePay payment
  private async processFonepayPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In a real implementation, this would redirect to FonePay or call their API
    console.log(`Processing FonePay payment of NPR ${amount}`);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Process ConnectIPS payment
  private async processConnectIpsPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In a real implementation, this would redirect to ConnectIPS or call their API
    console.log(`Processing ConnectIPS payment of NPR ${amount}`);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Validate card number (simple Luhn algorithm check)
  private validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and non-numeric characters
    const sanitizedNumber = cardNumber.replace(/\D/g, '');
    
    // Check if empty or not the right length
    if (!sanitizedNumber || sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
      return false;
    }
    
    // Simple validation for demo purposes
    return true;
  }
  
  // Validate expiry date (MM/YY format)
  private validateExpiryDate(expiryDate: string): boolean {
    // Check format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }
    
    const [monthStr, yearStr] = expiryDate.split('/');
    const month = parseInt(monthStr, 10);
    const year = 2000 + parseInt(yearStr, 10); // Convert YY to 20YY
    
    // Create a date for the last day of the expiry month
    const expiryDateObj = new Date(year, month, 0);
    const today = new Date();
    
    // Check if the card is expired
    return expiryDateObj > today && month >= 1 && month <= 12;
  }
  
  // Validate CVC (3-4 digits)
  private validateCVC(cvc: string): boolean {
    return /^\d{3,4}$/.test(cvc);
  }
  
  // Get available payment methods for the region
  public getAvailablePaymentMethods(): { id: PaymentMethod; name: string; logo: string }[] {
    return [
      {
        id: PaymentMethod.CARD,
        name: 'Credit/Debit Card',
        logo: 'https://cdn-icons-png.flaticon.com/512/179/179457.png'
      },
      {
        id: PaymentMethod.ESEWA,
        name: 'eSewa',
        logo: 'https://esewa.com.np/common/images/esewa_logo.png'
      },
      {
        id: PaymentMethod.KHALTI,
        name: 'Khalti',
        logo: 'https://khalti.com/static/images/khalti-logo.png'
      },
      {
        id: PaymentMethod.FONEPAY,
        name: 'FonePay',
        logo: 'https://fonepay.com/images/fonepay-logo.png'
      },
      {
        id: PaymentMethod.CONNECTIPS,
        name: 'ConnectIPS',
        logo: 'https://connectips.com/images/connectips-logo.png'
      }
    ];
  }
}

export const paymentService = new PaymentService();
