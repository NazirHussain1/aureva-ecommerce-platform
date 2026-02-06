import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading } = useSelector((state) => state.auth);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login', { replace: true });
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
