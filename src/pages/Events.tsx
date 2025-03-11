
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { events } from '@/data/events';
import { Event, EventCategory } from '@/types';

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Events - NepalTix';
    
    // Parse query params
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') as EventCategory | null;
    
    if (categoryParam && Object.values(EventCategory).includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      filterEvents(categoryParam);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.search]);

  const filterEvents = (category: EventCategory | null) => {
    let filtered = [...events];
    
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }
    
    setFilteredEvents(filtered);
  };

  const handleCategoryChange = (category: EventCategory | null) => {
    setSelectedCategory(category);
    
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    setShowFilters(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                {selectedCategory ? `${selectedCategory} Events` : 'All Events'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Discover and book tickets for the most exciting events across Nepal
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <button
                onClick={toggleFilters}
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red transition-colors duration-300 sm:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <div className={`sm:flex sm:flex-wrap gap-2 sm:justify-center w-full sm:w-auto ${showFilters ? 'flex flex-wrap' : 'hidden'}`}>
                <CategoryButton
                  isActive={selectedCategory === null}
                  onClick={() => handleCategoryChange(null)}
                >
                  All
                </CategoryButton>
                
                {Object.values(EventCategory).map((category) => (
                  <CategoryButton
                    key={category}
                    isActive={selectedCategory === category}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </CategoryButton>
                ))}
              </div>
              
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-nepal-red dark:hover:text-nepal-red transition-colors duration-300"
                >
                  Clear filter
                  <X className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                    <div className="p-5 bg-white dark:bg-gray-800 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                      No events found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try changing your filter or check back later for new events.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="animate-fade-in">
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface CategoryButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton = ({ children, isActive, onClick }: CategoryButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-nepal-red text-white'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

export default Events;
