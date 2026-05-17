import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import BrandLogo from '../../components/common/BrandLogo';
import { login } from '../../features/auth/authSlice';

const accountBenefits = [
  'Track orders and returns from one place',
  'Save addresses for faster checkout',
  'Keep wishlist picks ready for your next routine',
];

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      navigate(result?.user?.role === 'admin' ? '/admin' : '/');
    } catch {
      // Auth slice owns the visible error state.
    }
  };

  return (
    <main className="min-h-screen bg-ivory-50">
      <div className="container-custom grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_480px] lg:py-16">
        <section className="hidden lg:block">
          <BrandLogo />

          <div className="mt-16 max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-normal text-rose-700">
              Customer account
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-stone-950">
              Welcome back to your beauty routine.
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Sign in to continue shopping, manage orders, and keep your saved
              essentials close at hand.
            </p>
          </div>

          <div className="mt-10 grid max-w-xl gap-3">
            {accountBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 border-b border-stone-200 py-4">
                <FiShield className="h-5 w-5 text-plum-800" />
                <span className="text-sm font-medium text-stone-700">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
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
                Sign in
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-950">Access your account</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Use the email and password connected to your Aureva account.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">Login failed</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                    placeholder="Enter your password"
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
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  <input
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-300 text-plum-800 focus:ring-plum-700"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-plum-800 hover:text-plum-950">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="h-5 w-5 animate-spin" />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in
                    <FiArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
              New to Aureva?{' '}
              <Link to="/register" className="font-semibold text-plum-800 hover:text-plum-950">
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-stone-500">
            By signing in, you agree to our{' '}
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
