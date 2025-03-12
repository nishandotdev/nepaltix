
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

const Account = () => {
  const navigate = useNavigate();
  const { user } = authService.getCurrentUser();
  const [tickets, setTickets] = useState<DigitalTicket[]>([]);
  const [activeTab, setActiveTab] = useState("tickets");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - My Account";
    
    if (user) {
      // Fetch user's tickets
      const userTickets = dbService.getTicketsByUserId(user.id);
      setTickets(userTickets);
    }
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold">My Account</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="mt-4 sm:mt-0">
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-8">
              <TabsTrigger value="tickets">My Tickets</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {user.role === UserRole.ORGANIZER && (
                <TabsTrigger value="events" onClick={() => navigate("/organizer")}>
                  Manage Events
                </TabsTrigger>
              )}
              {user.role === UserRole.ADMIN && (
                <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="tickets">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">My Tickets</h2>
                
                {tickets.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
                    <p className="text-gray-500 mb-4">
                      Looks like you haven't purchased any tickets yet.
                    </p>
                    <Button onClick={() => navigate("/events")}>
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Input id="role" value={user.role} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="created">Member Since</Label>
                    <Input 
                      id="created" 
                      value={new Date(user.createdAt).toLocaleDateString()} 
                      readOnly 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user.role === UserRole.ADMIN && (
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>
                      Manage the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {authService.getUsers().length}
                          </p>
                          <p className="text-sm text-gray-500">Registered users</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {dbService.getAllTickets().length}
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
