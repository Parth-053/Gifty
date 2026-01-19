import React from 'react'
import { Toaster } from 'react-hot-toast'
import AdminRoutes from './routes/AdminRoutes'

function App() {
  return (
    <>
      {/* Global Notification Configuration */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#ecfdf5', // Green-50
              color: '#15803d',      // Green-700
              border: '1px solid #bbf7d0',
              fontWeight: '600',
            },
            iconTheme: {
              primary: '#15803d',
              secondary: '#ecfdf5',
            },
          },
          error: {
            style: {
              background: '#fef2f2', // Red-50
              color: '#b91c1c',      // Red-700
              border: '1px solid #fecaca',
              fontWeight: '600',
            },
            iconTheme: {
              primary: '#b91c1c',
              secondary: '#fef2f2',
            },
          },
        }}
      />
      
      {/* Main Routing System */}
      <AdminRoutes />
    </>
  )
}

export default App