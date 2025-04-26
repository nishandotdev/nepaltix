
import { createRoot } from 'react-dom/client'
import React from 'react'; // Explicitly import React
import App from './App.tsx'
import './index.css'

// Initialize the database and services
import { dbService } from './lib/dbService';
import { authService } from './lib/authService';

// This serves to ensure the services are initialized at app startup
console.log('Initializing services...');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
