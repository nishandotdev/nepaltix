
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, Edit, Trash2, QrCode, Users, TicketCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EventCategory, Event } from '@/types';
import { eventService } from '@/lib/eventService';
import { dbService } from '@/lib/dbService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const OrganizerDashboard = () => {
  const queryClient = useQueryClient();
  // Remove the local state for events as we'll use React Query instead
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    shortDescription: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    imageUrl: '',
    category: EventCategory.FESTIVAL,
    featured: false,
    totalTickets: 100,
    availableTickets: 100,
    tags: []
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [scannedTickets, setScannedTickets] = useState<Array<{id: string, eventId: string, timestamp: Date}>>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch events using React Query
  const { data: eventsList = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAllEvents(),
    initialData: []
  });
  
  // Fetch all tickets from database
  const { data: allTickets = [] } = useQuery({
    queryKey: ['allTickets'],
    queryFn: () => dbService.getAllTickets(),
    initialData: []
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully."
      });
      // Invalidate and refetch events query after deletion
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
    },
    onError: (error) => {
      console.error('Failed to delete event:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;
    
    if (name === 'price' || name === 'totalTickets' || name === 'availableTickets') {
      processedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  const handleCreateEvent = () => {
    if (!validateForm()) return;
    
    const newEvent: Event = {
      ...formData as Event,
      id: Math.random().toString(36).substring(2, 9),
      availableTickets: formData.totalTickets || 0
    };
    
    // Instead of updating local state, create event in database via service
    eventService.createEvent(newEvent)
      .then(() => {
        toast({
          title: "Event Created",
          description: `${newEvent.title} has been created successfully.`
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        
        // Reset form
        setFormData({
          title: '',
          shortDescription: '',
          description: '',
          date: '',
          time: '',
          location: '',
          price: 0,
          imageUrl: '',
          category: EventCategory.FESTIVAL,
          featured: false,
          totalTickets: 100,
          availableTickets: 100,
          tags: []
        });
      })
      .catch(error => {
        console.error("Failed to create event:", error);
        toast({
          title: "Creation Failed",
          description: "Failed to create the event. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  const handleUpdateEvent = () => {
    if (!selectedEvent || !validateForm()) return;
    
    const updatedEvent = { ...formData, id: selectedEvent.id } as Event;
    
    // Update the event via service instead of local state
    eventService.updateEvent(selectedEvent.id, formData)
      .then(() => {
        toast({
          title: "Event Updated",
          description: `${formData.title} has been updated successfully.`
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        
        setSelectedEvent(null);
      })
      .catch(error => {
        console.error("Failed to update event:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update the event. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData(event);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };
  
  const validateForm = () => {
    const requiredFields = [
      'title', 'shortDescription', 'description', 
      'date', 'time', 'location', 'imageUrl'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if ((formData.price || 0) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return false;
    }
    
    if ((formData.totalTickets || 0) <= 0) {
      toast({
        title: "Invalid Ticket Count",
        description: "Please enter a valid number of tickets greater than 0.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleScanTicket = () => {
    // Simulate scanning a ticket
    const randomEventIndex = Math.floor(Math.random() * eventsList.length);
    const randomEvent = eventsList[randomEventIndex];
    const ticketId = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    setScannedTickets(prev => [
      { id: ticketId, eventId: randomEvent.id, timestamp: new Date() },
      ...prev
    ]);
    
    toast({
      title: "Ticket Scanned Successfully",
      description: `Ticket ${ticketId} for ${randomEvent.title} is valid.`
    });
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Event Organizer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your events, track attendance, and scan tickets
            </p>
          </div>
          
          <Tabs defaultValue="events" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="tickets">Ticket Scanner</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Events</h2>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-nepal-red hover:bg-nepal-red/90">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Create New Event
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedEvent ? 'Edit Event' : 'Create New Event'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 md:col-span-2">
                        <div>
                          <Label htmlFor="title">Event Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter event title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="shortDescription">Short Description</Label>
                          <Input
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            placeholder="Brief description for event cards"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Full Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Detailed description of your event"
                            rows={5}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="date">Event Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="time">Event Time</Label>
                          <Input
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            placeholder="e.g. 7:00 PM - 10:00 PM"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Event venue or location"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => handleSelectChange('category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(EventCategory).map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="price">Ticket Price (NPR)</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price?.toString()}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="totalTickets">Total Tickets</Label>
                          <Input
                            id="totalTickets"
                            name="totalTickets"
                            type="number"
                            value={formData.totalTickets?.toString()}
                            onChange={handleInputChange}
                            placeholder="100"
                            min="1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                          />
                          <Label htmlFor="featured">Feature this event on homepage</Label>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            id="tags"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add tag"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          />
                          <Button type="button" onClick={handleAddTag}>Add</Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-2 py-1">
                              {tag}
                              <button 
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="mr-2">
                          Cancel
                        </Button>
                      </DialogClose>
                      
                      <DialogClose asChild>
                        <Button 
                          className="bg-nepal-red hover:bg-nepal-red/90"
                          onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                        >
                          {selectedEvent ? 'Update Event' : 'Create Event'}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {eventsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsList.map(event => (
                    <div 
                      key={event.id} 
                      className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
                    >
                      <div className="aspect-[16/9] relative">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                        
                        {event.featured && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-nepal-red">Featured</Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {new Date(event.date).toLocaleDateString()} | {event.location}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-nepal-red">
                            {new Intl.NumberFormat('ne-NP', { 
                              style: 'currency', 
                              currency: 'NPR',
                              minimumFractionDigits: 0
                            }).format(event.price)}
                          </span>
                          
                          <span className="text-sm">
                            {event.availableTickets}/{event.totalTickets} tickets left
                          </span>
                        </div>
                        
                        <div className="flex mt-4 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create your first event to get started
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-nepal-red hover:bg-nepal-red/90">
                        Create New Event
                      </Button>
                    </DialogTrigger>
                    {/* Dialog content same as above */}
                  </Dialog>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tickets" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">All Tickets</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  View and manage all tickets purchased for your events
                </p>
              </div>
              
              {allTickets.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTickets.map((ticket) => {
                      const event = eventsList.find(e => e.id === ticket.eventId);
                      return (
                        <div 
                          key={ticket.id} 
                          className="bg-gradient-to-br from-nepal-red/5 to-transparent border border-nepal-red/20 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge className="bg-nepal-red text-white mb-2">
                                {ticket.ticketType}
                              </Badge>
                              <h3 className="font-semibold text-sm">{event?.title || 'Unknown Event'}</h3>
                            </div>
                            <Badge variant={ticket.used ? "secondary" : "default"} className={ticket.used ? "bg-gray-400" : "bg-green-500"}>
                              {ticket.used ? 'Used' : 'Active'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="font-medium">{ticket.quantity}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Access Code:</span>
                              <span className="font-mono text-xs">{ticket.accessCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Purchase Date:</span>
                              <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <TicketCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Tickets purchased for your events will appear here
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/events')}
                  >
                    View Events
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="attendees" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Attendees</h2>
                
                <Select defaultValue={eventsList[0]?.id}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventsList.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center py-16">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Attendee List</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  When users book tickets, they'll appear here
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/events')}
                >
                  View Events
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default OrganizerDashboard;
