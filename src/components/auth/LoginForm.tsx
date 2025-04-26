
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [error, setError] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when input changes
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { email, password } = loginData;
    
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      // Added login delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = await authService.login(email, password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
        
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
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillDemoAccount = (type: 'admin' | 'organizer' | 'user') => {
    if (type === 'admin') {
      setLoginData({
        email: 'admin@nepaltix.com',
        password: 'admin123',
      });
    } else if (type === 'organizer') {
      setLoginData({
        email: 'organizer@nepaltix.com',
        password: 'organizer123',
      });
    } else {
      setLoginData({
        email: 'user@nepaltix.com',
        password: 'user123',
      });
    }
    setError(null);
  };

  return (
    <form onSubmit={handleLogin}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive" className="border-red-300 bg-red-50 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              disabled={isLoading}
              className="pl-10 transition-all focus:border-nepal-red focus:ring-nepal-red"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" size="sm" className="text-xs text-nepal-red p-0 h-auto">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              disabled={isLoading}
              className="pl-10 transition-all focus:border-nepal-red focus:ring-nepal-red"
            />
          </div>
        </div>
        
        <TooltipProvider>
          <div className="pt-2 space-y-2">
            <p className="text-sm text-gray-500">Demo Accounts:</p>
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red"
                    onClick={() => autoFillDemoAccount('admin')}
                  >
                    Admin
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>admin@nepaltix.com / admin123</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red"
                    onClick={() => autoFillDemoAccount('organizer')}
                  >
                    Organizer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>organizer@nepaltix.com / organizer123</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red"
                    onClick={() => autoFillDemoAccount('user')}
                  >
                    Regular User
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>user@nepaltix.com / user123</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-nepal-red hover:bg-nepal-red/90 transition-all" 
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
