import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store'; // Redux Store import
import App from './App';
import './index.css'; // Global Styles & Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux Provider for Global State Management */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);