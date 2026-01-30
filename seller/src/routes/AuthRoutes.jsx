import React, { lazy, Suspense } from 'react';
import Loader from '../components/common/Loader';

// Lazy Load Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const PendingApproval = lazy(() => import('../pages/auth/PendingApproval'));

// Loading Wrapper
const SuspenseLoader = ({ children }) => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
    {children}
  </Suspense>
);

const AuthRoutes = {
  path: '/auth',
  children: [
    { path: 'login', element: <SuspenseLoader><Login /></SuspenseLoader> },
    { path: 'register', element: <SuspenseLoader><Register /></SuspenseLoader> },
    { path: 'forgot-password', element: <SuspenseLoader><ForgotPassword /></SuspenseLoader> },
    { path: 'pending-approval', element: <SuspenseLoader><PendingApproval /></SuspenseLoader> },
  ]
};

export default AuthRoutes;