import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import BrandLogo from '../../components/common/BrandLogo';
import { register } from '../../features/auth/authSlice';

const welcomePoints = [
  'Faster checkout with saved delivery details',
  'Wishlist access across skincare, makeup, and fragrance',
  'Order history, returns, and updates in one account',
];

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialFormData);
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = 'Register - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;

    let strength = 0;
    if (formData.password.length >= 6) strength += 1;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    return strength;
  }, [formData.password]);

  const passwordStrengthLabel = useMemo(() => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very strong';
  }, [passwordStrength]);

  const passwordStrengthColor = passwordStrength <= 2 ? 'bg-rose-500' : 'bg-plum-800';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
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
      const registerData = { ...formData };
      delete registerData.confirmPassword;
      await dispatch(register(registerData)).unwrap();
      navigate('/login');
    } catch (err) {
      setLocalError(err || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-ivory-50">
      <div className="container-custom grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_520px] lg:py-16">
        <section className="hidden lg:block">
          <BrandLogo />

          <div className="mt-16 max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-normal text-rose-700">
              Create account
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-stone-950">
              Start building a beauty shelf that feels personal.
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Create an account for a smoother checkout, saved picks, and order
              updates without extra steps.
            </p>
          </div>

          <div className="mt-10 grid max-w-xl gap-3">
            {welcomePoints.map((point) => (
              <div key={point} className="flex items-center gap-3 border-b border-stone-200 py-4">
                <FiCheck className="h-5 w-5 text-plum-800" />
                <span className="text-sm font-medium text-stone-700">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <BrandLogo />
            <Link to="/" className="text-sm font-semibold text-stone-600 hover:text-plum-800">
              Home
            </Link>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <Link
              to="/"
              className="mb-8 hidden items-center gap-2 text-sm font-semibold text-stone-500 hover:text-plum-800 lg:inline-flex"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-rose-700">
                Join Aureva
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-950">Create your account</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Add your details once and keep every order easier to manage.
              </p>
            </div>

            {(error || localError) && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">Registration failed</p>
                <p className="mt-1 text-sm text-red-700">{localError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Full name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input pl-12"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
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
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input pl-12 pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-plum-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-500">Password strength</span>
                      <span className="font-semibold text-stone-700">{passwordStrengthLabel}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrengthColor}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Confirm password
                </label>
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input pl-12 pr-12"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-plum-800"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>

                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-plum-800">
                    <FiCheck className="h-4 w-4" />
                    Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="h-5 w-5 animate-spin" />
                    Creating account
                  </>
                ) : (
                  <>
                    Create account
                    <FiArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-plum-800 hover:text-plum-950">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-stone-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms-of-service" className="font-semibold text-stone-700 hover:text-plum-800">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="font-semibold text-stone-700 hover:text-plum-800">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
