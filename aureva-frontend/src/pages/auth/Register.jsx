import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/authSlice';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { MdCheckCircle } from 'react-icons/md';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    document.title = 'Register - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 6) strength++;
      if (formData.password.length >= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-green-500';
    return 'bg-emerald-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setLocalError(err || 'Registration failed. Please try again.');
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
          <p className="text-gray-600 text-lg">Create your account to get started</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and discover amazing beauty products</p>
          </div>

          {(error || localError) && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 animate-slideInDown">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <p className="text-red-800 font-medium">{localError || error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input pl-12"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength <= 2 ? 'text-red-600' : 
                      passwordStrength <= 3 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiShield className="text-gray-400 text-lg" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input pl-12 pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <MdCheckCircle className="text-lg" />
                  <span className="text-sm font-medium">Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 touch-target"
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin text-xl" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-purple-600 hover:text-purple-700 transition inline-flex items-center gap-1"
              >
                Sign in
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
            By creating an account, you agree to our{' '}
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
