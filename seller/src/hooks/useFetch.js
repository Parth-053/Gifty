import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; 

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Avoid fetching if no URL provided
    if (!url) return;

    setLoading(true);
    setError(null);
    try {
      // Using custom api instance to handle Bearer tokens automatically
      const response = await api.get(url, options);
      setData(response.data.data); // Backend returns data inside 'data' property
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return refetch to trigger manual updates 
  return { data, loading, error, refetch: fetchData };
};