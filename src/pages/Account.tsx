
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/authService";
import { dbService } from "@/lib/dbService";
import { DigitalTicket, User, UserRole } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DigitalTicketCard from "@/components/DigitalTicketCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";

const Account = () => {
  const navigate = useNavigate();
  const { user } = authService.getCurrentUser();
  const [tickets, setTickets] = useState<DigitalTicket[]>([]);
  const [activeTab, setActiveTab] = useState("tickets");
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - My Account";
    
    const fetchUserData = async () => {
      setIsLoading(true);
      if (user) {
        try {
          // Fetch user's tickets
          const userTickets = await dbService.getTicketsByUserId(user.id);
          setTickets(userTickets);
          
          // If user is admin, fetch counts
          if (user.role === UserRole.ADMIN) {
            const tickets = await dbService.getAllTickets();
            setTicketCount(tickets.length);
            
            // Get user profiles count from Supabase
            const { count } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true });
            
            setUserCount(count || 0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load account data");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="mt-4 sm:mt-0 border-nepal-red text-nepal-red hover:bg-nepal-red/5">
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
            <TabsList className="w-full mb-8 bg-white border border-gray-100 p-1 rounded-lg shadow-sm">
              <TabsTrigger value="tickets" className="data-[state=active]:bg-nepal-red data-[state=active]:text-white">
                My Tickets
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-nepal-red data-[state=active]:text-white">
                Profile
              </TabsTrigger>
              {user.role === UserRole.ORGANIZER && (
                <TabsTrigger 
                  value="events" 
                  onClick={() => navigate("/organizer")}
                  className="data-[state=active]:bg-nepal-red data-[state=active]:text-white"
                >
                  Manage Events
                </TabsTrigger>
              )}
              {user.role === UserRole.ADMIN && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-nepal-red data-[state=active]:text-white">
                  Admin Dashboard
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="tickets">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">My Tickets</h2>
                
                {isLoading ? (
                  <div className="bg-white rounded-lg p-16 text-center shadow-sm border border-gray-100">
                    <Loader size={32} text="Loading your tickets..." />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
                    <p className="text-gray-500 mb-4">
                      Looks like you haven't purchased any tickets yet.
                    </p>
                    <Button onClick={() => navigate("/events")} className="bg-nepal-red hover:bg-nepal-red/90">
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {tickets.map((ticket) => (
                      <DigitalTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.name} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Input id="role" value={user.role} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="created">Member Since</Label>
                    <Input 
                      id="created" 
                      value={new Date(user.createdAt).toLocaleDateString()} 
                      readOnly 
                      className="bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user.role === UserRole.ADMIN && (
              <TabsContent value="admin">
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>
                      Manage the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-gray-900">Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-nepal-red">
                            {userCount}
                          </p>
                          <p className="text-sm text-gray-500">Registered users</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-gray-900">Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-nepal-red">
                            {ticketCount}
                          </p>
                          <p className="text-sm text-gray-500">Tickets sold</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
