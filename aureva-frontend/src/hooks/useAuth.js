// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

/**
 * Custom hook to access authentication state and actions
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab auth state from Redux
  const { user, token, loading } = useSelector((state) => state.auth);

  // Check authentication status
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login', { replace: true }); // replace prevents back navigation to protected pages
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    logout: handleLogout,
  };
}
