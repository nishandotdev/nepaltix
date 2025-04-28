
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ywdlmodikgstzbbykuho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZGxtb2Rpa2dzdHpiYnlrdWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MTg2ODIsImV4cCI6MjA1NzQ5NDY4Mn0.Fz4HC9TWCpePrxyLcCNJiDAs-g2iI-EswOqYVAyUbeU";

// Create the Supabase client with explicit auth config
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

console.log("Supabase client initialized");

// Export a function to check if the client is working
export const checkSupabaseConnection = async () => {
  try {
    // Make a simple query to check if the connection works
    const { data, error } = await supabase.from('events').select('count').limit(1);
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }
    
    console.log("Supabase connection test successful");
    return true;
  } catch (error) {
    console.error("Supabase connection test failed with exception:", error);
    return false;
  }
};
