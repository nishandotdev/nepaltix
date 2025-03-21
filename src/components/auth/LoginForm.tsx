
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { email, password } = loginData;
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        toast.success("Login successful");
        
        // Redirect based on user role
        if (result.user?.role === UserRole.ADMIN) {
          navigate("/organizer");
        } else if (result.user?.role === UserRole.ORGANIZER) {
          navigate("/organizer");
        } else {
          // Check if there's a redirect URL stored
          const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            sessionStorage.removeItem("redirectAfterLogin");
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillDemoAccount = (type: 'admin' | 'organizer') => {
    if (type === 'admin') {
      setLoginData({
        email: 'admin@nepaltix.com',
        password: 'admin123',
      });
    } else {
      setLoginData({
        email: 'organizer@nepaltix.com',
        password: 'organizer123',
      });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={loginData.email}
            onChange={handleLoginChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={handleLoginChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="pt-2 space-y-2">
          <p className="text-sm text-gray-500">Demo Accounts:</p>
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => autoFillDemoAccount('admin')}
            >
              Admin
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => autoFillDemoAccount('organizer')}
            >
              Organizer
            </Button>
          </div>
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
