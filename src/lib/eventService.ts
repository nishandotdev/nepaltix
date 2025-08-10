import { Event, EventCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { events as localEvents } from '@/data/events';
import { queryClient } from '@/lib/queryClient';

class EventService {
  // Get all events - optimized for instant loading
  async getAllEvents(): Promise<Event[]> {
    // Return local data immediately for instant loading
    return localEvents;
  }
  
  // Get featured events - optimized for instant loading
  async getFeaturedEvents(): Promise<Event[]> {
    // Return local featured events immediately
    return localEvents.filter(event => event.featured);
  }
  
  // Get event by ID - optimized for instant loading
  async getEventById(id: string): Promise<Event | null> {
    // Return local event immediately
    return localEvents.find(event => event.id === id) || null;
  }
  
  // Create a new event
  async createEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error("Cannot create event - user not authenticated");
        return null;
      }
      
      // Map frontend model to DB fields
      const dbEvent = {
        title: event.title,
        description: event.description,
        short_description: event.shortDescription,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        category: event.category,
        image_url: event.imageUrl,
        tags: event.tags,
        featured: event.featured,
        total_tickets: event.totalTickets,
        available_tickets: event.availableTickets,
        created_by: userData.user.id,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([dbEvent])
        .select()
        .single();
      
      if (error) {
        console.error("Error creating event:", error);
        return null;
      }
      
      // Map DB response back to frontend model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category as EventCategory,
        imageUrl: data.image_url,
        tags: data.tags || [],
        featured: !!data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets
      };
    } catch (error) {
      console.error("Error in createEvent:", error);
      return null;
    }
  }
  
  // Update an existing event
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      // Convert frontend model field names to database field names
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.time !== undefined) dbUpdates.time = updates.time;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.totalTickets !== undefined) dbUpdates.total_tickets = updates.totalTickets;
      if (updates.availableTickets !== undefined) dbUpdates.available_tickets = updates.availableTickets;
      
      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating event:", error);
        return null;
      }
      
      // Map DB response back to frontend model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        date: data.date,
        time: data.time,
        location: data.location,
        price: data.price,
        category: data.category as EventCategory,
        imageUrl: data.image_url,
        tags: data.tags || [],
        featured: !!data.featured,
        totalTickets: data.total_tickets,
        availableTickets: data.available_tickets
      };
    } catch (error) {
      console.error("Error in updateEvent:", error);
      return null;
    }
  }
  
  // Delete an event
  async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting event:", error);
        return false;
      }
      
      // Invalidate all event-related queries to ensure UI updates correctly
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
      console.log(`Event ${id} deleted successfully and cache invalidated`);
      
      return true;
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      return false;
    }
  }
  
  // Seed events data into Supabase from local events data
  async seedEvents(): Promise<boolean> {
    try {
      console.log("Seeding events data into Supabase...");
      
      // Prepare events data for database
      const dbEvents = localEvents.map(event => ({
        title: event.title,
        description: event.description,
        short_description: event.shortDescription,
        date: event.date,
        time: event.time,
        location: event.location,
        price: event.price,
        category: event.category,
        image_url: event.imageUrl,
        tags: event.tags,
        featured: event.featured,
        total_tickets: event.totalTickets,
        available_tickets: event.availableTickets,
        created_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('events')
        .insert(dbEvents);
      
      if (error) {
        console.error("Error seeding events:", error);
        return false;
      }
      
      console.log("Successfully seeded events data");
      return true;
    } catch (error) {
      console.error("Error in seedEvents:", error);
      return false;
    }
  }
}

export const eventService = new EventService();