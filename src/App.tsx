
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Checkout from "./pages/Checkout";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import TicketScanner from "./pages/TicketScanner";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Tickets from "./pages/Tickets";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "./types";

// Create a client
const queryClient = new QueryClient();

// Load database and initialize it
import { dbService } from "./lib/dbService";
import { authService } from "./lib/authService";

// Initialize database (this is done automatically in the constructor)
// Just importing it here to ensure it's loaded at application start

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route 
            path="/checkout/:id" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer" 
            element={
              <ProtectedRoute requiredRoles={[UserRole.ORGANIZER, UserRole.ADMIN]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute requiredRoles={[UserRole.ORGANIZER, UserRole.ADMIN]}>
                <TicketScanner />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            } 
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
