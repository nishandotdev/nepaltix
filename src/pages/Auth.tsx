
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authService } from "@/lib/authService";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            className="text-3xl sm:text-4xl font-serif font-bold text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to <span className="text-nepal-red">NepalTix</span>
          </motion.h1>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Ticket booking experience" 
                  className="object-cover w-full h-48 transition-transform duration-700 hover:scale-105"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
                <span className="bg-nepal-red/10 text-nepal-red p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </span>
                Discover Nepal's Best Events
              </h2>
              
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red text-white mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-300">Book tickets to top events throughout Nepal</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red text-white mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-300">Store and access your digital tickets anytime</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red text-white mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-300">Get updates about upcoming events</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nepal-red text-white mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-300">Secure payments with local options</span>
                </motion.li>
              </ul>
              
              <div className="mt-8 p-4 bg-nepal-red/5 rounded-lg border border-nepal-red/10">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "Join thousands of locals and tourists discovering authentic experiences across Nepal with NepalTix - your gateway to cultural events, adventures, and unforgettable memories."
                </p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AuthForm />
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
