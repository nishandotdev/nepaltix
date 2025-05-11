
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { authService } from "@/lib/authService";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import LoginFields from "./LoginFields";
import DemoAccounts from "./DemoAccounts";
import ConnectionStatus from "./ConnectionStatus";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      const isConnected = await checkSupabaseConnection();
      setConnectionTested(true);
      setConnectionSuccess(isConnected);
      
      if (!isConnected) {
        setError("Database connection failed. Please try again later or use demo accounts.");
        setIsLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          console.log("User session already exists");
          // Small delay for better UX
          setTimeout(() => {
            navigate("/");
            setIsLoading(false);
          }, 300);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setIsLoading(false);
      }
    };
    
    testConnection();
  }, [navigate, setIsLoading]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleDemoAccount = (type: 'admin' | 'organizer' | 'user') => {
    if (type === 'admin') {
      setLoginData({ email: 'admin@nepaltix.com', password: 'admin123' });
    } else if (type === 'organizer') {
      setLoginData({ email: 'organizer@nepaltix.com', password: 'organizer123' });
    } else {
      setLoginData({ email: 'user@nepaltix.com', password: 'user123' });
    }
    setError(null);
    
    // Auto-login for better demo experience
    setTimeout(() => {
      handleLogin(new Event('click') as unknown as React.FormEvent);
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!loginData.email || !loginData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400)); // Reduced UI feedback delay for faster experience
      console.log("Attempting login with:", loginData.email);
      
      const result = await authService.login(loginData.email, loginData.password);
      
      if (result.success) {
        handleSuccessfulLogin(result.user?.name, result.user?.role);
      } else {
        console.error("Login failed with message:", result.message);
        setError(result.message);
        toast.error(result.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (name?: string, role?: UserRole) => {
    toast.success(`Welcome back, ${name || 'User'}!`);
    
    if (role === UserRole.ADMIN || role === UserRole.ORGANIZER) {
      navigate("/organizer");
    } else {
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    }
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
        
        <LoginFields 
          email={loginData.email}
          password={loginData.password}
          isLoading={isLoading}
          onChange={handleLoginChange}
        />
        
        <DemoAccounts 
          onSelectAccount={handleDemoAccount}
          connectionTested={connectionTested}
        />
        
        <ConnectionStatus 
          connectionTested={connectionTested}
          connectionSuccess={connectionSuccess}
        />
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
