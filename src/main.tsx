
import { createRoot } from 'react-dom/client'
import React from 'react'; // Explicitly import React
import App from './App.tsx'
import './index.css'

// Import the optimized query client
import { queryClient, prefetchCommonData } from './lib/queryClient';

// Initialize the database and services
import { dbService } from './lib/dbService';
import { authService } from './lib/authService';
import { eventService } from './lib/eventService'; // Ensure eventService is imported
import { supabase } from './integrations/supabase/client';

console.log('Initializing services...');

// Verify eventService is available
console.log('Event service initialized:', eventService !== undefined);

console.log('Database service initialized:', dbService !== undefined);
console.log('Auth service initialized:', authService !== undefined);

// Prefetch event data to ensure it's available
console.log('Prefetching events data...');
queryClient.prefetchQuery({
  queryKey: ['featuredEvents'],
  queryFn: () => eventService.getFeaturedEvents()
}).catch(error => {
  console.warn('Failed to prefetch events data:', error);
  // Continue app initialization even if prefetch fails
});

// Prefetch common data for performance
prefetchCommonData().catch(error => {
  console.warn('Failed to prefetch common data:', error);
  // Continue app initialization even if prefetch fails
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  
  // Only update the local state after we receive auth events
  if (event === 'SIGNED_OUT') {
    sessionStorage.removeItem('nepal_ticketing_auth');
  }
});

// Create a function to initialize the app
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found. Cannot mount React app.');
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('React app successfully mounted.');
  } catch (error) {
    console.error('Failed to render React app:', error);
  }
};

// Initialize the app either when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
