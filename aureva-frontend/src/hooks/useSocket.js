import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { logout } from '../features/auth/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/auth/login', { replace: true });
  }, [dispatch, navigate]);

  const requireAuth = useCallback(
    (redirectPath = '/auth/login') => {
      if (!isAuthenticated) navigate(redirectPath, { replace: true });
    },
    [isAuthenticated, navigate]
  );

  const requireAdmin = useCallback(
    (redirectPath = '/') => {
      if (!isAdmin) navigate(redirectPath, { replace: true });
    },
    [isAdmin, navigate]
  );

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
