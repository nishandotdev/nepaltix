
import { createRoot } from 'react-dom/client'
import React from 'react'; // Explicitly import React
import App from './App.tsx'
import './index.css'

// Import the optimized query client
import { queryClient, prefetchCommonData } from './lib/queryClient';

// Initialize the database and services
import { dbService } from './lib/dbService';
import { authService } from './lib/authService';
import { supabase, checkSupabaseConnection } from './integrations/supabase/client';

// This serves to ensure the services are initialized at app startup
console.log('Initializing services...');

// Check Supabase connection on startup
checkSupabaseConnection().then(isConnected => {
  console.log('Supabase connection status:', isConnected);
  
  console.log('Database service initialized:', dbService !== undefined);
  console.log('Auth service initialized:', authService !== undefined);
  
  if (isConnected) {
    console.log('Application ready to use');
    
    // Prefetch common data for performance
    prefetchCommonData().catch(console.error);
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      // Only update the local state after we receive auth events
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('nepal_ticketing_auth');
      }
    });
  } else {
    console.error('WARNING: Supabase connection failed. Some features may not work correctly.');
  }
});

// Ensure DOM is fully loaded before attaching React
document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById("root")!);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
