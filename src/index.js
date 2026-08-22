import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Import App normally
import { AuthProvider } from './context/AuthContext'; // Updated path to the new context file
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider is now the "Single Source of Truth" 
          coming from its own dedicated file. 
      */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);