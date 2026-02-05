import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout: handleLogout,
  };
}
