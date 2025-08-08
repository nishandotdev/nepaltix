import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, SlidersHorizontal } from 'lucide-react';
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
import { Event, EventCategory } from '@/types';
import { eventService } from '@/lib/eventService';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '@/lib/performance';

// Define category labels as constant before using them
const categoryLabels: Record<EventCategory, string> = {
  [EventCategory.MUSIC]: 'Music',
  [EventCategory.CULTURE]: 'Culture',
  [EventCategory.FESTIVAL]: 'Festival',
  [EventCategory.SPORTS]: 'Sports',
  [EventCategory.FOOD]: 'Food',
  [EventCategory.ADVENTURE]: 'Adventure',
};

// Define category icons as constant before using them
const categoryIcons: Record<EventCategory, React.ReactNode> = {
  [EventCategory.MUSIC]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
  [EventCategory.CULTURE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2M5 3h14M5 8h14m-7-7v7m-7 6l7-7 7 7M5 19h14" /></svg>,
  [EventCategory.FESTIVAL]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  [EventCategory.SPORTS]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [EventCategory.FOOD]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  [EventCategory.ADVENTURE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
};

// Function to filter and sort events - defined before use
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

// Define sortEvents before use
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

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [sortBy, setSortBy] = useState("date-asc");
  const [showDialog, setShowDialog] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // Fetch events using React Query with improved error handling
  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const data = await eventService.getAllEvents();
        return data || [];
      } catch (error) {
        console.error("Error in events query:", error);
        // Show error toast and return empty array to prevent crashes
        toast.error("Failed to load events. Please try again.");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000, // Retry after 1 second, then 2 seconds
  });
  
  // Debounced search handler for better performance
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(e.target.value);
  };
  
  // Apply filters AFTER events are loaded
  const filteredEvents = events.length > 0 ? applyFilters(events, searchQuery, selectedCategories, sortBy) : [];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "NepalTix - Discover Events";
    
    // Delayed page load effect for smoother transitions
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);
    
    // Show demo payment success message if coming from checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success' || urlParams.get('booking') === 'success') {
      setTimeout(() => {
        toast.success("Payment successful! Your ticket has been emailed to you.", {
          duration: 5000,
        });
      }, 500);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
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
      
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isPageLoaded ? 1 : 0, y: isPageLoaded ? 0 : 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-nepal-red/10 border border-nepal-red/20 text-nepal-red text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-nepal-red rounded-full mr-2 animate-pulse"></span>
              {window.location.pathname === "/featured" ? "Featured Events" : "All Events"}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              {window.location.pathname === "/featured" ? "Nepal's Most Popular Events" : "Discover Events in Nepal"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              From cultural festivals to adventure expeditions, find your perfect experience in the heart of the Himalayas
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isPageLoaded ? 1 : 0, y: isPageLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-12 h-12 text-base border-gray-200 dark:border-gray-600 focus-visible:ring-nepal-red rounded-xl"
                  placeholder="Search events, venues, locations..."
                  defaultValue={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            
              <div className="flex gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 px-6 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      <span>Sort</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 rounded-xl">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-base">Sort Events</h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full h-11 rounded-xl">
                          <SelectValue placeholder="Choose sorting option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-asc">📅 Date (Earliest first)</SelectItem>
                          <SelectItem value="date-desc">📅 Date (Latest first)</SelectItem>
                          <SelectItem value="price-asc">💰 Price (Low to high)</SelectItem>
                          <SelectItem value="price-desc">💰 Price (High to low)</SelectItem>
                          <SelectItem value="alpha-asc">🔤 Name (A to Z)</SelectItem>
                          <SelectItem value="alpha-desc">🔤 Name (Z to A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-12 px-6 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Filter</span>
                      {selectedCategories.length > 0 && (
                        <Badge className="ml-1 bg-nepal-red text-white">{selectedCategories.length}</Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Filter Events</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <h3 className="font-semibold mb-4">Event Categories</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.values(EventCategory).map(category => (
                          <div key={category} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => toggleCategory(category)}>
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
                              <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700">
                                {categoryIcons[category]}
                              </span>
                              {categoryLabels[category]}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={clearFilters} className="rounded-xl">
                        Clear All
                      </Button>
                      <Button className="bg-nepal-red hover:bg-nepal-red/90 rounded-xl" onClick={() => setShowDialog(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 animate-fade-in">
              {/* --- New Improved Loader UI --- */}
              <div className="relative mb-5">
                {/* Placeholder for Nepali event illustration */}
                <img
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=480&q=80"
                  alt="Events Nepal"
                  className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-white animate-scale-in"
                  loading="lazy"
                />
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs bg-nepal-red/90 text-white font-semibold rounded-full shadow hover-scale">
                  Loading Events...
                </span>
              </div>
              <Loader2 className="h-8 w-8 text-nepal-red animate-spin mb-3" />
              <span className="text-lg text-gray-700 dark:text-gray-200 mb-1 font-semibold">
                Mahotsav (महोत्सव) coming soon...
              </span>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we fill your page with amazing events from across Nepal!
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2 text-red-600">Failed to load events</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Sorry, we couldn't load the events. Please try again.
              </p>
              <Button 
                className="bg-nepal-red hover:bg-nepal-red/90" 
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: Math.min(0.05 * index, 0.5) }}
                    onClick={() => handleEventClick(event.id)}
                    className="cursor-pointer"
                    layout
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
              animate={{ opacity: isPageLoaded ? 1 : 0 }}
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
