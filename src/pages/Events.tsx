
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, Calendar, Map, Tag, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { eventService } from '@/lib/eventService';
import { Event, EventCategory } from '@/types';
import { useQuery } from '@tanstack/react-query';

const categoryLabels: Record<EventCategory, string> = {
  [EventCategory.MUSIC]: 'Music',
  [EventCategory.CULTURE]: 'Culture',
  [EventCategory.FESTIVAL]: 'Festival',
  [EventCategory.SPORTS]: 'Sports',
  [EventCategory.FOOD]: 'Food',
  [EventCategory.ADVENTURE]: 'Adventure',
};

const categoryIcons: Record<EventCategory, React.ReactNode> = {
  [EventCategory.MUSIC]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
  [EventCategory.CULTURE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2M5 3h14M5 8h14m-7-7v7m-7 6l7-7 7 7M5 19h14" /></svg>,
  [EventCategory.FESTIVAL]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  [EventCategory.SPORTS]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [EventCategory.FOOD]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  [EventCategory.ADVENTURE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
};

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [sortBy, setSortBy] = useState("date-asc");
  const [showDialog, setShowDialog] = useState(false);
  
  // Fetch events using React Query
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAllEvents(),
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Error loading events:", error);
          toast.error("Failed to load events. Please try again.");
        }
      }
    }
  });
  
  // Filter and sort events based on user criteria
  const filteredEvents = applyFilters(events, searchQuery, selectedCategories, sortBy);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - Discover Events";
  }, []);
  
  // Function to filter and sort events
  function applyFilters(
    eventList: Event[], 
    query: string, 
    categories: EventCategory[], 
    sort: string
  ): Event[] {
    let results = [...eventList];
    
    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower) || 
        event.location.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (categories.length > 0) {
      results = results.filter(event => categories.includes(event.category));
    }
    
    // Apply sorting
    results = sortEvents(results, sort);
    
    return results;
  }
  
  const sortEvents = (eventList: Event[], sortOption: string) => {
    const sorted = [...eventList];
    
    switch (sortOption) {
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "alpha-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "alpha-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };
  
  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setShowDialog(false);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy("date-asc");
  };
  
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Discover Events in Nepal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Find and book tickets for the best events happening across Nepal
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 focus-visible:ring-nepal-red"
                placeholder="Search events, venues, or cities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Sort</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm mb-2">Sort by</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
                        <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                        <SelectItem value="price-asc">Price (Low to high)</SelectItem>
                        <SelectItem value="price-desc">Price (High to low)</SelectItem>
                        <SelectItem value="alpha-asc">Name (A to Z)</SelectItem>
                        <SelectItem value="alpha-desc">Name (Z to A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {selectedCategories.length > 0 && (
                      <Badge className="ml-1 bg-nepal-red text-white">{selectedCategories.length}</Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter Events</DialogTitle>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <h3 className="font-medium mb-3">Event Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(EventCategory).map(category => (
                        <div key={category} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => toggleCategory(category)}>
                          <Checkbox 
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                            className="data-[state=checked]:bg-nepal-red data-[state=checked]:border-nepal-red"
                          />
                          <label 
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center cursor-pointer"
                          >
                            <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800">
                              {categoryIcons[category]}
                            </span>
                            {categoryLabels[category]}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <Button className="bg-nepal-red hover:bg-nepal-red/90" onClick={() => setShowDialog(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
          
          {selectedCategories.length > 0 && (
            <motion.div 
              className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedCategories.map(category => (
                <Badge 
                  key={category}
                  variant="secondary" 
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {categoryLabels[category]}
                  <button 
                    className="ml-1 hover:text-nepal-red"
                    onClick={() => toggleCategory(category)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button 
                variant="link" 
                className="text-sm text-nepal-red p-0 h-auto"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </motion.div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <Loader2 className="h-8 w-8 text-nepal-red animate-spin" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading events...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-red-600">Failed to load events</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Sorry, we couldn't load the events. Please try again.
              </p>
              <Button 
                className="bg-nepal-red hover:bg-nepal-red/90" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    onClick={() => handleEventClick(event.id)}
                    className="cursor-pointer"
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16 sm:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="hover:bg-nepal-red hover:text-white transition-colors"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Events;
