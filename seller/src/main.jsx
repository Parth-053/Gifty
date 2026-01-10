import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tailwind & Global Styles

// State Management
import { Provider } from 'react-redux';
import store from './store';

// Context
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux Store Provider */}
    <Provider store={store}>
      {/* Theme Context Provider */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);