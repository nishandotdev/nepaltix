
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authService } from "@/lib/authService";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - Login or Register";
    
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-8">
            Welcome to NepalTix
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Discover Nepal's Best Events</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red/10 text-nepal-red mr-2">✓</span>
                  <span>Book tickets to top events throughout Nepal</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red/10 text-nepal-red mr-2">✓</span>
                  <span>Store and access your digital tickets anytime</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red/10 text-nepal-red mr-2">✓</span>
                  <span>Get updates about upcoming events</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red/10 text-nepal-red mr-2">✓</span>
                  <span>Secure payments with local options</span>
                </li>
              </ul>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                      <div className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="font-medium">Demo Accounts:</p>
                      <p className="text-sm mt-1 text-gray-500">
                        <span className="font-mono">organizer@nepaltix.com</span> / <span className="font-mono">organizer123</span>
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="p-2 max-w-xs">
                    <p className="text-xs">Admin account: <span className="font-mono">admin@nepaltix.com</span> / <span className="font-mono">admin123</span></p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <AuthForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
