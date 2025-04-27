
import { createRoot } from 'react-dom/client'
import React from 'react'; // Explicitly import React
import App from './App.tsx'
import './index.css'

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
