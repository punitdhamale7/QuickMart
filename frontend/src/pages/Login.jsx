import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiArrowRight,
  FiShoppingBag, FiTruck, FiShield,
} from 'react-icons/fi';

/* ── Left-panel feature row ── */
const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-sm font-semibold leading-snug text-white">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-green-100/80">{desc}</p>
    </div>
  </div>
);

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginService(form);
      if (res.success) {
        login(res.user, res.token);
        navigate(res.user.role === 'retailer' ? '/retailer/dashboard' : '/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* ══════════ LEFT PANEL — 45% ══════════ */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-600 to-green-800 p-12 lg:flex lg:w-[45%]">
        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md">
            <span className="text-lg font-extrabold text-green-700">Q</span>
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-white">QuickMart</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-green-200">
              Store &amp; Pickup
            </p>
          </div>
        </div>

        {/* Hero text + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-snug text-white">
              Skip the Queue.<br />
              Order Online.<br />
              Pick Up Fresh.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-green-100">
              Experience the new standard in grocery pickups. Order from your favourite local stores and collect when it's packed and ready.
            </p>
          </div>

          <div className="space-y-7">
            <Feature
              icon={FiShoppingBag}
              title="Easy Shopping"
              desc="Browse thousands of fresh items at local neighbourhood shops online."
            />
            <Feature
              icon={FiTruck}
              title="Quick Pickup"
              desc="Skip long queues. Collect your order the moment it's ready."
            />
            <Feature
              icon={FiShield}
              title="Secure Payments"
              desc="Encrypted transactions and real-time order status updates."
            />
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-green-300">
          © {new Date().getFullYear()} QuickMart. All rights reserved.
        </p>
      </div>

      {/* ══════════ RIGHT PANEL — 55% ══════════ */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-[55%]">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 shadow">
              <span className="text-lg font-extrabold text-white">Q</span>
            </div>
            <p className="text-lg font-bold text-slate-900">QuickMart</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue.</p>

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email" name="email" type="email"
                  required disabled={loading}
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <Link to="/login" className="text-xs font-semibold text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  required disabled={loading}
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember" type="checkbox"
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-green-600"
              />
              <label htmlFor="remember" className="cursor-pointer select-none text-xs font-medium text-slate-600">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign in <FiArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">New to QuickMart?</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <Link
            to="/signup"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-green-500/40 text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            Create an account
          </Link>

          <p className="mt-6 text-center text-xs text-slate-400">
            One account for customers and shopkeepers alike.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
