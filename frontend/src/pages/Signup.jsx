import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupService } from '../services/authService';
import {
  FiUser, FiMail, FiPhone, FiLock,
  FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle,
  FiArrowRight, FiShoppingCart, FiShoppingBag, FiShield,
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

/* ── Field wrapper ── */
const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    {children}
  </div>
);

const INPUT_CLS_BASE =
  'h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:bg-slate-50';

const INPUT_CLS = `${INPUT_CLS_BASE} pr-4`;
const INPUT_CLS_WITH_ICON = `${INPUT_CLS_BASE} pr-10`;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '',
    password: '', confirmPassword: '', accountType: 'customer',
  });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [showConf, setShowConf] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await signupService({
        full_name: form.fullName,
        email:     form.email,
        phone:     form.phoneNumber,
        password:  form.password,
        role:      form.accountType,
      });
      if (res.success) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = form.accountType === 'customer';
  const isRetailer = form.accountType === 'retailer';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* ══════════ LEFT PANEL — 45% ══════════ */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-600 to-green-800 p-12 lg:flex lg:w-[45%]">
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

        {/* Hero + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-snug text-white">
              Skip the Queue.<br />
              Order Online.<br />
              Pick Up Fresh.
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-green-100">
              Create your free account and start shopping from local grocery stores or manage your own store on our platform.
            </p>
          </div>

          <div className="space-y-7">
            <Feature
              icon={FiShoppingCart}
              title="Easy Shopping"
              desc="Browse thousands of fresh items at local neighbourhood shops online."
            />
            <Feature
              icon={FiShoppingBag}
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

        <p className="relative z-10 text-xs text-green-300">
          © {new Date().getFullYear()} QuickMart. All rights reserved.
        </p>
      </div>

      {/* ══════════ RIGHT PANEL — 55% ══════════ */}
      <div className="flex w-full items-center justify-center overflow-y-auto p-6 sm:p-10 lg:w-[55%]">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 shadow">
              <span className="text-lg font-extrabold text-white">Q</span>
            </div>
            <p className="text-lg font-bold text-slate-900">QuickMart</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Fill in the details below to get started.</p>

          {/* Account type toggle */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">I am a</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'customer', icon: FiShoppingCart, label: 'Customer'   },
                { type: 'retailer', icon: FiShoppingBag,  label: 'Shopkeeper' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  disabled={loading}
                  onClick={() => setForm({ ...form, accountType: type })}
                  className={[
                    'flex h-10 items-center justify-center gap-2 rounded-lg border text-xs font-semibold transition-all',
                    form.accountType === type
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <Field id="fullName" label="Full Name">
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="fullName" name="fullName" type="text"
                  required disabled={loading}
                  value={form.fullName} onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className={INPUT_CLS}
                />
              </div>
            </Field>

            <Field id="email" label="Email Address">
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email" name="email" type="email"
                  required disabled={loading}
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={INPUT_CLS}
                />
              </div>
            </Field>

            <Field id="phoneNumber" label="Phone Number">
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="phoneNumber" name="phoneNumber" type="tel"
                  required pattern="[0-9]{10}" disabled={loading}
                  value={form.phoneNumber} onChange={handleChange}
                  placeholder="9876543210"
                  className={INPUT_CLS}
                />
              </div>
            </Field>

            <Field id="password" label="Password">
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  required minLength={6} disabled={loading}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={INPUT_CLS_WITH_ICON}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Field id="confirmPassword" label="Confirm Password">
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConf ? 'text' : 'password'}
                  required disabled={loading}
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password"
                  className={INPUT_CLS_WITH_ICON}
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConf ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms" type="checkbox" required disabled={loading}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 accent-green-600"
              />
              <label htmlFor="terms" className="cursor-pointer select-none text-xs leading-snug text-slate-600">
                I agree to the{' '}
                <Link to="/signup" className="font-semibold text-green-600 hover:text-green-700">
                  Terms &amp; Conditions
                </Link>
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
                  Creating account…
                </>
              ) : (
                <>Create Account <FiArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
