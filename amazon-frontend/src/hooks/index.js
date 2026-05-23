import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useDebounce = (callback, delay) => {
  let timeoutId;
  return useCallback((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export const useLocalStorage = (key) => {
  const getItem = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }, [key]);

  const setItem = useCallback((value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  const removeItem = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return { getItem, setItem, removeItem };
};

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      return null;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};

export const useFormInput = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);

  const bind = {
    value,
    onChange: (e) => setValue(e.target.value),
  };

  const reset = () => setValue(initialValue);

  return [value, bind, reset];
};
