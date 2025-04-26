
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, PieChart, CalendarDays, TicketCheck, ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalTicketCard from "@/components/DigitalTicketCard";
import { DigitalTicket, TicketType } from "@/types";
import { dbService } from "@/lib/dbService";
import { authService } from "@/lib/authService";
import { Loader } from "@/components/ui/loader";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Tickets = () => {
  const [tickets, setTickets] = useState<DigitalTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<DigitalTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "dashboard">("grid");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        const authData = await authService.getCurrentUser();
        if (!authData.isAuthenticated || !authData.user) {
          // Store the current path to redirect back after login
          sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
          navigate("/auth", { replace: true });
          return;
        }
        
        const userTickets = await dbService.getTicketsByUserId(authData.user.id);
        setTickets(userTickets);
        setFilteredTickets(userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast.error("Failed to load tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [navigate]);
  
  useEffect(() => {
    if (filterType === null) {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(ticket => ticket.ticketType === filterType));
    }
  }, [filterType, tickets]);

  const clearFilter = () => {
    setFilterType(null);
  };
  
  const sortTickets = () => {
    const sorted = [...filteredTickets].sort((a, b) => {
      const dateA = new Date(a.purchaseDate);
      const dateB = new Date(b.purchaseDate);
      return sortOrder === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
    setFilteredTickets(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Helper functions for dashboard metrics
  const getUpcomingEvents = () => {
    return filteredTickets.filter(ticket => 
      !ticket.used && new Date() < new Date(ticket.purchaseDate)
    ).length;
  };
  
  const getUsedTickets = () => {
    return filteredTickets.filter(ticket => ticket.used).length;
  };
  
  const getTicketStatsByType = () => {
    const stats: Record<string, number> = {};
    filteredTickets.forEach(ticket => {
      stats[ticket.ticketType] = (stats[ticket.ticketType] || 0) + 1;
    });
    return stats;
  };
  
  const getNextEventDate = () => {
    const upcoming = filteredTickets
      .filter(ticket => !ticket.used)
      .sort((a, b) => 
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      );
    
    return upcoming.length > 0 ? new Date(upcoming[0].purchaseDate).toLocaleDateString() : "No upcoming events";
  };

  const formatTicketTypeDisplayName = (type: string) => {
    // Convert SNAKE_CASE to Title Case with spaces
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16 pb-20">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              My Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Access and manage all your event tickets
            </p>
          </div>
          
          {!loading && tickets.length > 0 && (
            <>
              <Tabs defaultValue="grid" className="w-full mb-6" onValueChange={(value) => setViewMode(value as "grid" | "dashboard")}>
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={sortTickets}
                      className="flex items-center"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort by Date ({sortOrder === "asc" ? "Oldest" : "Newest"})
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          {filterType ? `Showing: ${formatTicketTypeDisplayName(filterType)}` : "Filter tickets"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFilterType(TicketType.STANDARD)}>
                          Standard Tickets
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType(TicketType.VIP)}>
                          VIP & Backstage Passes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType(TicketType.EARLY_BIRD)}>
                          Early Bird Tickets
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterType(TicketType.FAN_ZONE)}>
                          Team Fan Zone Tickets
                        </DropdownMenuItem>
                        {filterType && (
                          <DropdownMenuItem onClick={clearFilter}>
                            Clear Filter
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <TabsContent value="grid" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredTickets.map((ticket) => (
                      <DigitalTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="dashboard" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Tickets
                        </CardTitle>
                        <TicketCheck className="h-4 w-4 text-nepal-red" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{filteredTickets.length}</div>
                        <p className="text-xs text-muted-foreground">
                          {filterType ? `${formatTicketTypeDisplayName(filterType)} tickets` : "All ticket types"}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Upcoming Events
                        </CardTitle>
                        <CalendarDays className="h-4 w-4 text-nepal-red" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getUpcomingEvents()}</div>
                        <p className="text-xs text-muted-foreground">
                          Next event: {getNextEventDate()}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Ticket Usage
                        </CardTitle>
                        <PieChart className="h-4 w-4 text-nepal-red" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getUsedTickets()} / {filteredTickets.length}</div>
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-nepal-red h-full" 
                            style={{ 
                              width: `${filteredTickets.length > 0 
                                ? (getUsedTickets() / filteredTickets.length) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {filteredTickets.length > 0 
                            ? `${Math.round((getUsedTickets() / filteredTickets.length) * 100)}% tickets used` 
                            : "No tickets"
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ticket Breakdown</CardTitle>
                        <CardDescription>
                          Summary of your tickets by type
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(getTicketStatsByType()).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  type === TicketType.STANDARD ? "bg-blue-500" :
                                  type === TicketType.VIP ? "bg-purple-500" :
                                  type === TicketType.EARLY_BIRD ? "bg-green-500" :
                                  "bg-amber-500"
                                }`}></div>
                                <span className="font-medium">{formatTicketTypeDisplayName(type)}</span>
                              </div>
                              <span className="text-gray-500">{count} ticket{count !== 1 ? 's' : ''}</span>
                            </div>
                          ))}
                          
                          <div className="pt-4">
                            <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              {Object.entries(getTicketStatsByType()).map(([type, count], index) => (
                                <div
                                  key={type}
                                  className={`${
                                    type === TicketType.STANDARD ? "bg-blue-500" :
                                    type === TicketType.VIP ? "bg-purple-500" :
                                    type === TicketType.EARLY_BIRD ? "bg-green-500" :
                                    "bg-amber-500"
                                  }`}
                                  style={{
                                    width: `${(count / filteredTickets.length) * 100}%`
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredTickets.map((ticket) => (
                        <DigitalTicketCard key={ticket.id} ticket={ticket} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size={40} text="Loading your tickets..." />
            </div>
          ) : filteredTickets.length === 0 && (
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
                {filterType ? `No ${formatTicketTypeDisplayName(filterType)} Tickets Found` : "No Tickets Found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {filterType 
                  ? `You don't have any ${formatTicketTypeDisplayName(filterType)} tickets. Try a different filter or browse our events.`
                  : "You haven't purchased any tickets yet. Browse our events to find something interesting!"}
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
