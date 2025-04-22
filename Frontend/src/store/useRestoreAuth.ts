import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, setRehydrated } from './authSlice';

const useRestoreAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem('user') ?? sessionStorage.getItem('user');
    if (stored) {
      try {
        const { token, role } = JSON.parse(stored);
        if (token && role) {
          dispatch(setCredentials({ token, role }));
          return; // Skip rehydrated dispatch, already done inside setCredentials
        }
      } catch (e) {
        console.warn("Invalid auth data in storage.");
      }
    }

    // Fallback: no credentials, still mark as rehydrated
    dispatch(setRehydrated());
  }, [dispatch]);
};

export default useRestoreAuth;
