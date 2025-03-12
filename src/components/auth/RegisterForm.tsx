
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegisterFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onRegisterSuccess: (email: string, password: string) => void;
}

const RegisterForm = ({ isLoading, setIsLoading, onRegisterSuccess }: RegisterFormProps) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRole.USER,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    
    const { name, email, password, confirmPassword } = registerData;
    
    // Form validation
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const result = authService.register({
        name,
        email,
        password,
        role: registerData.role,
      });
      
      if (result.success) {
        toast.success("Registration successful! Please login.");
        onRegisterSuccess(email, password);
      } else {
        toast.error(result.message);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleRegister}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
            disabled={isLoading}
            className={errors.name ? "border-red-300" : ""}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
            disabled={isLoading}
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Account Type</Label>
          <Select 
            disabled={isLoading}
            value={registerData.role} 
            onValueChange={handleRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.USER}>Regular User</SelectItem>
              <SelectItem value={UserRole.ORGANIZER}>Event Organizer</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {registerData.role === UserRole.USER 
              ? "Regular users can browse and book tickets to events" 
              : "Organizers can create and manage their own events"}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
            disabled={isLoading}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password ? (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          ) : (
            <p className="text-xs text-gray-500">Must be at least 6 characters</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
            disabled={isLoading}
            className={errors.confirmPassword ? "border-red-300" : ""}
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-nepal-red hover:bg-nepal-red/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
