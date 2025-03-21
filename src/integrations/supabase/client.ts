
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ywdlmodikgstzbbykuho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZGxtb2Rpa2dzdHpiYnlrdWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MTg2ODIsImV4cCI6MjA1NzQ5NDY4Mn0.Fz4HC9TWCpePrxyLcCNJiDAs-g2iI-EswOqYVAyUbeU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
