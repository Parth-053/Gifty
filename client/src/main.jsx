import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Imports
import App from './App';
import store from './store';
import './index.css';  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        
        {/* Global Toast Configuration */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              style: { background: 'green' },
              iconTheme: { primary: 'white', secondary: 'green' },
            },
            error: {
              style: { background: '#e11d48' },
              iconTheme: { primary: 'white', secondary: '#e11d48' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);