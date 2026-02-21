import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiArrowRight, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdCheckCircle } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    document.title = 'Forgot Password - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/users/forgot-password', { email });
      setStep(2);
      setTimer(600);
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/verify-otp', { email, otp });
      setResetToken(response.data.resetToken);
      setStep(3);
      toast.success('OTP verified successfully!');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/users/reset-password', { 
        token: resetToken, 
        newPassword: password 
      });
      setStep(4);
      toast.success('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await axios.post('/api/users/forgot-password', { email });
      setTimer(600);
      setOtp('');
      toast.success('New OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center w-full max-w-md relative z-10 animate-scaleIn">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MdCheckCircle className="text-5xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset!</h2>
          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. You can now login with your new password.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 touch-target"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3 ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiMail className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-12"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 touch-target"
                >
                  {loading ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-xl" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiMail className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-2">
                  We've sent a 6-digit code to
                </p>
                <p className="text-purple-600 font-bold">{email}</p>
                <p className="text-sm text-gray-500 mt-4">
                  ⏰ Code expires in: <span className="font-bold text-red-600">{formatTime(timer)}</span>
                </p>
              </div>

              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input text-center text-2xl tracking-widest font-bold"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 touch-target"
                >
                  {loading ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-xl" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading || timer > 0}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiLock className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h2>
                <p className="text-gray-600">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-12 pr-12"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pl-12 pr-12"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 touch-target"
                >
                  {loading ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-xl" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
