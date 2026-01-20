import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './routes'; 
import { ThemeProvider } from './context/ThemeContext'; 
import Loader from './components/common/Loader'; 

const App = () => {
  return (
    <ThemeProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          },
        }}
      />
      
      {/* Suspense handles the lazy loading of routes */}
      <Suspense fallback={<Loader fullScreen text="Loading Gifty Seller Hub..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;