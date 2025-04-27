
import { useState, useEffect } from "react";
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
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";

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
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  // Test the Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      console.log("Supabase connection status:", isConnected);
      setConnectionTested(true);
      setConnectionSuccess(isConnected);
      
      if (!isConnected) {
        setError("Database connection failed. Please try again later.");
        return;
      }
      
      // Check if there's already a session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("User session already exists");
        navigate("/");
      }
    };
    
    testConnection();
  }, [navigate]);

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
      console.log("Starting login process for:", email);
      
      // Simplified demo login for test accounts
      if (email === "admin@nepaltix.com" && password === "admin123") {
        toast.success("Welcome back, Admin!");
        // Create a mock user for demo purposes
        const demoUser = {
          id: "demo-admin-id",
          name: "Admin User",
          email: "admin@nepaltix.com",
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem("nepal_ticketing_auth", JSON.stringify({
          user: demoUser,
          isAuthenticated: true
        }));
        navigate("/organizer");
        return;
      }
      
      if (email === "organizer@nepaltix.com" && password === "organizer123") {
        toast.success("Welcome back, Organizer!");
        // Create a mock user for demo purposes
        const demoUser = {
          id: "demo-organizer-id",
          name: "Organizer User",
          email: "organizer@nepaltix.com",
          role: UserRole.ORGANIZER,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem("nepal_ticketing_auth", JSON.stringify({
          user: demoUser,
          isAuthenticated: true
        }));
        navigate("/organizer");
        return;
      }
      
      if (email === "user@nepaltix.com" && password === "user123") {
        toast.success("Welcome back, User!");
        // Create a mock user for demo purposes
        const demoUser = {
          id: "demo-user-id",
          name: "Regular User",
          email: "user@nepaltix.com",
          role: UserRole.USER,
          createdAt: new Date().toISOString()
        };
        sessionStorage.setItem("nepal_ticketing_auth", JSON.stringify({
          user: demoUser,
          isAuthenticated: true
        }));
        navigate("/");
        return;
      }
      
      // Added login delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      const result = await authService.login(email, password);
      
      console.log("Login result:", result);
      
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
    <form onSubmit={handleLogin} className="animate-in fade-in-50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-serif">Sign In</CardTitle>
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
            <Alert variant="destructive" className="border-red-300 bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
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
        
        {connectionTested && (
          <TooltipProvider>
            <div className="pt-2 space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Demo Accounts:</p>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
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
                      className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
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
                      className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
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
        )}
        
        {connectionTested && !connectionSuccess && (
          <div className="py-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md flex items-center space-x-2">
            <AlertTriangle size={16} />
            <span>Database connection failed. Please try again later.</span>
          </div>
        )}
        
        {!connectionTested && (
          <div className="py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Checking database connection...</span>
          </div>
        )}
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
