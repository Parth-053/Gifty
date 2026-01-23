// src/main.jsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './store'; // Import your store
import App from './App';
import './index.css';
import { SellerAuthProvider } from './context/SellerAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SellerAuthProvider>
        <App />
      </SellerAuthProvider>
    </Provider>
  </React.StrictMode>
);