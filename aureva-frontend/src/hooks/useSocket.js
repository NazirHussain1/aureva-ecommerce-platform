// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { logout } from '../features/auth/authSlice';

/**
 * Custom hook to access authentication state, actions, and route guards
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab auth state from Redux
  const { user, token, loading } = useSelector((state) => state.auth);

  // Authentication status
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  /**
   * Logout function
   * Clears auth state and redirects to login
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/auth/login', { replace: true });
  }, [dispatch, navigate]);

  /**
   * Guard function for routes requiring authentication
   * Redirects to login if not authenticated
   */
  const requireAuth = useCallback(
    (redirectPath = '/auth/login') => {
      if (!isAuthenticated) navigate(redirectPath, { replace: true });
    },
    [isAuthenticated, navigate]
  );

  /**
   * Guard function for admin-only routes
   * Redirects to home if not admin
   */
  const requireAdmin = useCallback(
    (redirectPath = '/') => {
      if (!isAdmin) navigate(redirectPath, { replace: true });
    },
    [isAdmin, navigate]
  );

  // Memoize return object for better performance
  return useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      logout: handleLogout,
      requireAuth,
      requireAdmin,
    }),
    [user, token, loading, isAuthenticated, isAdmin, handleLogout, requireAuth, requireAdmin]
  );
}
