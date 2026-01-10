import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* Centralized Route Configuration */}
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;