// src/hooks/useRestoreAuth.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';

const useRestoreAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem('user') ?? sessionStorage.getItem('user');
    if (stored) {
      try {
        const { token, role } = JSON.parse(stored);
        if (token && role) {
          dispatch(setCredentials({ token, role }));
        }
      } catch (e) {
        console.warn("Invalid auth data in storage.");
      }
    }
  }, [dispatch]);
};

export default useRestoreAuth;
