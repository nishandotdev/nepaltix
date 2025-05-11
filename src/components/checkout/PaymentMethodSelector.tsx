
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Phone } from 'lucide-react';
import { PaymentInfo, PaymentMethod } from '@/types';

interface PaymentMethodSelectorProps {
  initialPaymentInfo: PaymentInfo;
  onChange: (paymentInfo: PaymentInfo) => void;
}

const PaymentMethodSelector = ({ initialPaymentInfo, onChange }: PaymentMethodSelectorProps) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(initialPaymentInfo);

  useEffect(() => {
    setPaymentInfo(initialPaymentInfo);
  }, [initialPaymentInfo]);

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPaymentInfo = { ...paymentInfo, [name]: value };
    setPaymentInfo(updatedPaymentInfo);
    onChange(updatedPaymentInfo);
  };

  const handleTabChange = (value: string) => {
    const updatedPaymentInfo = {
      ...paymentInfo,
      paymentMethod: value as PaymentMethod
    };
    setPaymentInfo(updatedPaymentInfo);
    onChange(updatedPaymentInfo);
  };

  return (
    <Tabs defaultValue={paymentInfo.paymentMethod} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="CARD">Card</TabsTrigger>
        <TabsTrigger value="KHALTI">Khalti</TabsTrigger>
        <TabsTrigger value="ESEWA">eSewa</TabsTrigger>
        <TabsTrigger value="FONEPAY">FonePay</TabsTrigger>
        <TabsTrigger value="CONNECTIPS">ConnectIPS</TabsTrigger>
      </TabsList>
      
      <TabsContent value="CARD" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentInfoChange}
            placeholder="1234 5678 9012 3456"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handlePaymentInfoChange}
              placeholder="MM/YY"
            />
          </div>
          
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              name="cvc"
              value={paymentInfo.cvc}
              onChange={handlePaymentInfoChange}
              placeholder="123"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="KHALTI" className="pt-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="mb-3">Continue to pay with Khalti</p>
          <img 
            src="https://seeklogo.com/images/K/khalti-logo-F0B049E68F-seeklogo.com.png" 
            alt="Khalti Logo" 
            className="h-8 mx-auto mb-3"
            loading="lazy"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            <span>9749377349</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
        </div>
      </TabsContent>
      
      <TabsContent value="ESEWA" className="pt-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="mb-3">Continue to pay with eSewa</p>
          <img 
            src="https://esewa.com.np/common/images/esewa_logo.png" 
            alt="eSewa Logo" 
            className="h-8 mx-auto mb-3"
            loading="lazy"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            <span>9749377349</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
        </div>
      </TabsContent>
      
      <TabsContent value="FONEPAY" className="pt-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="mb-3">Continue to pay with FonePay</p>
          <img 
            src="https://fonepay.com/images/logo.png" 
            alt="FonePay Logo" 
            className="h-8 mx-auto mb-3"
            loading="lazy"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            <span>9749377349</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
        </div>
      </TabsContent>
      
      <TabsContent value="CONNECTIPS" className="pt-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="mb-3">Continue to pay with ConnectIPS</p>
          <img 
            src="https://connectips.com/images/connectips.png" 
            alt="ConnectIPS Logo" 
            className="h-8 mx-auto mb-3"
            loading="lazy"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            <span>9749377349</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use this number for test payments</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodSelector;
