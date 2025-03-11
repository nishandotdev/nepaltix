
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authService } from "@/lib/authService";

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
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-medium">Demo Accounts:</p>
                <p className="text-sm mt-1">Admin: admin@nepaltix.com / admin123</p>
                <p className="text-sm">Organizer: organizer@nepaltix.com / organizer123</p>
              </div>
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
