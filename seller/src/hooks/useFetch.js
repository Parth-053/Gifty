import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Ensure axios is installed

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your axios instance or fetch
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData]);

  // Return refetch function to manually trigger updates
  return { data, loading, error, refetch: fetchData };
};