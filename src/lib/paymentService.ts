
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
      console.log('Processing payment with method:', paymentInfo.paymentMethod);
      
      // For performance - optimize network simulation time
      const processingDelay = Math.floor(Math.random() * 300) + 300; // 0.3-0.6 second (improved for faster demo)
      
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
      
      // For demo purposes, always succeed to provide consistent experience
      console.log('Demo payment processed successfully for', paymentInfo.paymentMethod);
      onSuccess();
      return;
    } catch (error) {
      console.error('Payment processing error:', error);
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
  
  // Process card payment
  private async processCardPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // For demo, accept any card input
    if (paymentInfo.cardNumber && !this.validateCardNumber(paymentInfo.cardNumber)) {
      console.log('Demo mode: Accepting any card number format');
    }
    
    console.log(`Processing card payment of NPR ${amount}`);
    // Simulating API call for payment
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Process eSewa payment
  private async processEsewaPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In demo mode, we'll accept any eSewa payment
    console.log(`Processing eSewa payment of NPR ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Process Khalti payment
  private async processKhaltiPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In demo mode, we'll accept any Khalti payment
    console.log(`Processing Khalti payment of NPR ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Process FonePay payment
  private async processFonepayPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In demo mode, we'll accept any FonePay payment
    console.log(`Processing FonePay payment of NPR ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Process ConnectIPS payment
  private async processConnectIpsPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    // In demo mode, we'll accept any ConnectIPS payment
    console.log(`Processing ConnectIPS payment of NPR ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Validate card number (simple Luhn algorithm check) - but in demo mode we're more permissive
  private validateCardNumber(cardNumber: string): boolean {
    // For demo purposes, accept common test card numbers and any input
    const testCards = [
      '4242424242424242', // Visa test card
      '5555555555554444', // Mastercard test card
      '378282246310005',  // Amex test card
      '6011111111111117', // Discover test card
    ];
    
    // Remove spaces and non-numeric characters
    const sanitizedNumber = cardNumber.replace(/\D/g, '');
    
    // Accept test cards for demo
    if (testCards.includes(sanitizedNumber)) {
      return true;
    }
    
    // In demo mode, be very permissive
    return sanitizedNumber.length >= 4;
  }
  
  // Validate expiry date (MM/YY format) - but in demo mode we're more permissive
  private validateExpiryDate(expiryDate: string): boolean {
    // For demo, be more forgiving with date formats
    return true;
  }
  
  // Validate CVC (3-4 digits) - but in demo mode we're more permissive
  private validateCVC(cvc: string): boolean {
    // For demo purposes, be more permissive
    return true;
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
