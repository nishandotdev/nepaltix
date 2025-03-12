
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { name, email, password, confirmPassword, role } = registerData;
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const result = authService.register({
        name,
        email,
        password,
        role,
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
          />
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
          />
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
          />
          <p className="text-xs text-gray-500">Must be at least 6 characters</p>
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
          />
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
