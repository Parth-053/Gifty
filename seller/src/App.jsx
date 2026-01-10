import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SellerRoutes from './routes/SellerRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* Centralized Routing Logic */}
      <SellerRoutes />
    </BrowserRouter>
  );
}

export default App;