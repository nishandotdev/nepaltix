
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from '@/types';
import { eventService } from '@/lib/eventService';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const FeaturedEvents = () => {
  const { toast } = useToast();
  
  const { data: visibleEvents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      try {
        const featuredEvents = await eventService.getFeaturedEvents();
        return featuredEvents.slice(0, 3);
      } catch (err) {
        console.error("Error fetching featured events:", err);
        return [];
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error loading featured events:", error);
        toast({
          title: "Error loading events",
          description: "Could not load featured events. Please try again later.",
          variant: "destructive"
        });
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  return (
    <section className="py-16 sm:py-24 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium text-nepal-red bg-nepal-red/10 rounded-full mb-4">
            Don't Miss Out
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Featured Events
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover our handpicked selection of unmissable events happening across Nepal
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-nepal-red animate-spin" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading featured events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 rounded-xl shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Sorry, we couldn't load the featured events</p>
            <button 
              className="text-nepal-red hover:text-nepal-red/80 font-medium"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        ) : visibleEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visibleEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-fade-in hardware-accelerated"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} featured />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/featured"
                className="inline-flex items-center font-medium text-nepal-red hover:text-nepal-red/80 transition-colors duration-300 group"
              >
                View all featured events
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 rounded-xl shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">No featured events available at the moment</p>
            <div className="mt-6">
              <Link
                to="/events"
                className="inline-flex items-center font-medium text-nepal-red hover:text-nepal-red/80 transition-colors duration-300 group"
              >
                Browse all events
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
