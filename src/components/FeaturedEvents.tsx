
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import EventCard from './EventCard';
import { Event } from '@/types';
import { eventService } from '@/lib/eventService';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

const FeaturedEvents = () => {
  const { toast } = useToast();
  
  const { data: visibleEvents = [], isLoading } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      const featuredEvents = await eventService.getFeaturedEvents();
      return featuredEvents.slice(0, 3);
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
    }
  });

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((_, index) => (
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
        ) : visibleEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visibleEvents.map((event) => (
                <div key={event.id} className="animate-fade-in">
                  <EventCard event={event} featured />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="inline-flex items-center font-medium text-nepal-red hover:text-nepal-red/80 transition-colors duration-300 group"
              >
                View all events
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
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
