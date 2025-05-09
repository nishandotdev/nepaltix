
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
      
      // For demo - very fast processing time
      const processingDelay = Math.floor(Math.random() * 200) + 200; // 0.2-0.4 second (faster for demo)
      
      await new Promise(resolve => setTimeout(resolve, processingDelay));
      
      // In demo mode, all payments are successful regardless of method
      toast.success(`Demo payment processed with ${this.getMethodName(paymentInfo.paymentMethod)}`);
      
      // Different processing logic based on payment method, but all succeed in demo mode
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
          // Even unknown methods succeed in pure demo mode
          console.log(`Processing unknown payment method: ${paymentInfo.paymentMethod}`);
      }
      
      console.log('Demo payment processed successfully for', paymentInfo.paymentMethod);
      onSuccess();
      return;
    } catch (error) {
      // In pure demo mode, we should never reach this
      console.error('Payment processing error:', error);
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
  
  // Get friendly name for payment method
  private getMethodName(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CARD: return "Credit/Debit Card";
      case PaymentMethod.ESEWA: return "eSewa";
      case PaymentMethod.KHALTI: return "Khalti";
      case PaymentMethod.FONEPAY: return "FonePay";
      case PaymentMethod.CONNECTIPS: return "ConnectIPS";
      default: return "Unknown Method";
    }
  }
  
  // Process card payment - always succeeds in demo mode
  private async processCardPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    console.log(`DEMO MODE: Processing card payment of NPR ${amount}`);
    console.log('Card payment always succeeds in demo mode');
    // Simulating API call for payment - very short in demo mode
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Process eSewa payment - always succeeds in demo mode
  private async processEsewaPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    console.log(`DEMO MODE: Processing eSewa payment of NPR ${amount}`);
    console.log('eSewa payment always succeeds in demo mode');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Process Khalti payment - always succeeds in demo mode
  private async processKhaltiPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    console.log(`DEMO MODE: Processing Khalti payment of NPR ${amount}`);
    console.log('Khalti payment always succeeds in demo mode');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Process FonePay payment - always succeeds in demo mode
  private async processFonepayPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    console.log(`DEMO MODE: Processing FonePay payment of NPR ${amount}`);
    console.log('FonePay payment always succeeds in demo mode');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Process ConnectIPS payment - always succeeds in demo mode
  private async processConnectIpsPayment(paymentInfo: PaymentInfo, amount: number): Promise<void> {
    console.log(`DEMO MODE: Processing ConnectIPS payment of NPR ${amount}`);
    console.log('ConnectIPS payment always succeeds in demo mode');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Validate card number - accept any input in demo mode
  private validateCardNumber(cardNumber: string): boolean {
    console.log('DEMO MODE: Accepting any card number');
    return true;
  }
  
  // Validate expiry date - accept any format in demo mode
  private validateExpiryDate(expiryDate: string): boolean {
    console.log('DEMO MODE: Accepting any expiry date format');
    return true;
  }
  
  // Validate CVC - accept any input in demo mode
  private validateCVC(cvc: string): boolean {
    console.log('DEMO MODE: Accepting any CVC');
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
