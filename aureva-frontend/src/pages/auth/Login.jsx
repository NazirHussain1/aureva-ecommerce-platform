import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HiSparkles className="text-4xl text-purple-600 group-hover:scale-110 transition-transform" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Aureva Beauty
              </h1>
            </div>
          </Link>
          <p className="text-gray-600 text-lg">Welcome back! Sign in to continue</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-red-800 mb-1">Login Failed</h3>
                  <p className="text-sm text-red-700 mb-3">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      to="/forgot-password" 
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Reset Password
                    </Link>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create New Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 text-lg" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 text-lg" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input pl-12 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 touch-target"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin text-xl" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-bold text-purple-600 hover:text-purple-700 transition inline-flex items-center gap-1"
              >
                Create account
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1 justify-center"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms-of-service" className="text-purple-600 hover:text-purple-700 font-medium">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-700 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
