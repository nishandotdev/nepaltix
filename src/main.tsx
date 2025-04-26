
import { createRoot } from 'react-dom/client'
import React from 'react'; // Explicitly import React
import App from './App.tsx'
import './index.css'

// Initialize the database and services
import { dbService } from './lib/dbService';
import { authService } from './lib/authService';

// This serves to ensure the services are initialized at app startup
console.log('Initializing services...');
console.log('Database service initialized:', dbService !== undefined);
console.log('Auth service initialized:', authService !== undefined);

// Ensure DOM is fully loaded before attaching React
document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById("root")!);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
