import React, { lazy } from 'react';

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const PendingApproval = lazy(() => import('../pages/auth/PendingApproval'));

const AuthRoutes = {
  path: '/auth',
  children: [
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'verify-email', element: <VerifyEmail /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password/:token', element: <ResetPassword /> },
    { path: 'pending-approval', element: <PendingApproval /> },
  ]
};

export default AuthRoutes;