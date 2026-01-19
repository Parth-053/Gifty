import { useState, useEffect } from 'react';

/**
 * Custom hook to delay the value update until the user stops typing.
 * Useful for Search Inputs to avoid too many API calls.
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default 500ms)
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};