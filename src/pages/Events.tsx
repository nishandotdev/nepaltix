
import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { events } from '@/data/events';
import { Event, EventCategory } from '@/types';

const categoryLabels: Record<EventCategory, string> = {
  [EventCategory.MUSIC]: 'Music',
  [EventCategory.CULTURE]: 'Culture',
  [EventCategory.FESTIVAL]: 'Festival',
  [EventCategory.SPORTS]: 'Sports',
  [EventCategory.FOOD]: 'Food',
  [EventCategory.ADVENTURE]: 'Adventure',
};

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading from API
    setIsLoading(true);
    const timer = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategories]);
  
  const applyFilters = () => {
    let results = [...events];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(event => selectedCategories.includes(event.category));
    }
    
    // Sort by date (nearest first)
    results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredEvents(results);
  };
  
  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Discover Events in Nepal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Find and book tickets for the best events happening across Nepal
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search events, venues, or cities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
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
                  <div className="space-y-2">
                    {Object.values(EventCategory).map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
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
                  <DialogTrigger asChild>
                    <Button className="bg-nepal-red hover:bg-nepal-red/90">Apply Filters</Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-nepal-red animate-spin" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map(event => (
                <div key={event.id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Events;
