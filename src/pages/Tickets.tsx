
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalTicketCard from "@/components/DigitalTicketCard";
import { DigitalTicket } from "@/types";
import { dbService } from "@/lib/dbService";
import { authService } from "@/lib/authService";

const Tickets = () => {
  const [tickets, setTickets] = useState<DigitalTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        const authData = await authService.getCurrentUser();
        if (!authData.isAuthenticated || !authData.user) {
          navigate("/auth", { replace: true });
          return;
        }
        
        const userTickets = await dbService.getTicketsByUserId(authData.user.id);
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [navigate]);
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16 pb-20">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              My Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Access and manage all your event tickets
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-nepal-red animate-spin" />
              <span className="ml-2 text-gray-600">Loading your tickets...</span>
            </div>
          ) : tickets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tickets.map((ticket) => (
                <DigitalTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Tickets Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't purchased any tickets yet. Browse our events to find something interesting!
              </p>
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nepal-red hover:bg-nepal-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nepal-red"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Tickets;
