
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
import NotificationBell from "./components/NotificationBell";

// Create a client
const queryClient = new QueryClient();

// Load database and initialize it
import { dbService } from "./lib/dbService";

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
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/scanner" element={<TicketScanner />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
