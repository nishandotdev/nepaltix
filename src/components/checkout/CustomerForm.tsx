
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer } from '@/types';

interface CustomerFormProps {
  initialCustomer: Customer;
  onChange: (customer: Customer) => void;
}

const CustomerForm = ({ initialCustomer, onChange }: CustomerFormProps) => {
  const [customer, setCustomer] = useState<Customer>(initialCustomer);

  useEffect(() => {
    setCustomer(initialCustomer);
  }, [initialCustomer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedCustomer = { ...customer, [name]: value };
    setCustomer(updatedCustomer);
    onChange(updatedCustomer);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={customer.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={customer.email}
          onChange={handleInputChange}
          placeholder="Enter your email address"
          required
        />
        <p className="text-xs text-gray-500 mt-1">We'll email your tickets to this address</p>
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={customer.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          required
        />
      </div>
    </div>
  );
};

export default CustomerForm;
