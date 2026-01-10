import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routeConfig';

// Layouts & Wrappers
import SellerLayout from '../components/layout/SellerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loader from '../components/common/Loader';

const SellerRoutes = () => {
  // Separate routes by layout type
  const authRoutes = routes.filter(r => r.layout === 'auth');
  const sellerRoutes = routes.filter(r => r.layout === 'seller');

  return (
    <Suspense fallback={<Loader fullScreen={true} text="Loading Seller Hub..." />}>
      <Routes>
        
        {/* =========================================
            1. PUBLIC / AUTH ROUTES (No Sidebar)
           ========================================= */}
        {authRoutes.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}

        {/* =========================================
            2. PROTECTED SELLER ROUTES (With Sidebar)
           ========================================= */}
        <Route element={
          <ProtectedRoute>
            <SellerLayout />
          </ProtectedRoute>
        }>
          {sellerRoutes.map((route, index) => (
            <Route 
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        {/* =========================================
            3. FALLBACK ROUTES
           ========================================= */}
        {/* Redirect unknown routes to Dashboard if logged in, else Login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Suspense>
  );
};

export default SellerRoutes;