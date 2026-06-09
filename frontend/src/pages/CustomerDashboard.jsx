import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingBag, FiHeart, FiMapPin, FiClock,
  FiGrid, FiTruck, FiShield, FiUser,
  FiArrowRight, FiPackage,
} from 'react-icons/fi';
import CustomerShell from '../components/customer/CustomerShell';

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, bg, color, onClick }) => (
  <button onClick={onClick}
    className="flex flex-col justify-between border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow text-left w-full"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <div className={`flex h-8 w-8 items-center justify-center ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
    </div>
    <p className="text-3xl font-bold leading-none tracking-tight text-slate-900">{value}</p>
  </button>
);

/* ── Feature action card ── */
const FeatureCard = ({ icon: Icon, label, desc, path, iconBg, iconColor, badge }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)}
      className="group flex items-center gap-4 border border-slate-200 bg-white p-4 hover:border-green-300 hover:bg-green-50 transition-all text-left w-full shadow-sm hover:shadow-md"
    >
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {badge && (
            <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold">{badge}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{desc}</p>
      </div>
      <FiArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
    </button>
  );
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName   = user?.full_name?.split(' ')[0] ?? 'Customer';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CU';

  return (
    <CustomerShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 px-8 py-8 text-white shadow-lg mb-8">
          <div className="absolute -right-8 -top-8 h-40 w-40 bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-green-200">Welcome back 👋</p>
              <h1 className="mt-1 text-2xl font-bold text-white">{firstName}</h1>
              <p className="mt-1 text-sm text-green-100">Browse local stores and order fresh groceries for quick pickup.</p>
              <p className="mt-2 text-xs text-green-300">Member since {memberSince}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center bg-white/20 text-xl font-bold text-white border-2 border-white/30 flex-shrink-0">
              {initials}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <StatCard icon={FiShoppingBag} label="Total Orders"    value="0" bg="bg-blue-50"   color="text-blue-600"   onClick={() => navigate('/customer/orders')}    />
          <StatCard icon={FiClock}       label="Active Orders"   value="0" bg="bg-orange-50" color="text-orange-600" onClick={() => navigate('/customer/orders')}    />
          <StatCard icon={FiHeart}       label="Favourites"      value="0" bg="bg-red-50"    color="text-red-500"    onClick={() => navigate('/customer/favourites')} />
          <StatCard icon={FiMapPin}      label="Saved Addresses" value="0" bg="bg-purple-50" color="text-purple-600" onClick={() => navigate('/customer/addresses')}  />
        </div>

        {/* ── Main content: Profile + Features ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Profile card */}
          <div className="border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-green-600 text-sm font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{user?.full_name}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Phone',        value: user?.phone || '—'     },
                { label: 'Account Type', value: user?.role,  cap: true },
                { label: 'Member Since', value: memberSince            },
              ].map(({ label, value, cap }) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                  <span className={`text-xs font-semibold text-slate-700 ${cap ? 'capitalize' : ''}`}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                <span className="inline-flex items-center gap-1.5 border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 bg-green-500" /> Active
                </span>
              </div>
            </div>

            <button onClick={() => navigate('/customer/profile')}
              className="mt-6 flex w-full items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <FiUser className="h-4 w-4 text-slate-500" /> Edit Profile
            </button>
          </div>

          {/* ── Feature Grid (replaces Coming Soon) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Section title */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Quick Access</h2>
              <span className="text-xs text-slate-400">All features available</span>
            </div>

            {/* 2-column feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FeatureCard
                icon={FiGrid}
                label="Browse Shops"
                desc="Discover local grocery stores near you"
                path="/customer/shops"
                iconBg="bg-green-50"
                iconColor="text-green-600"
                badge="Live"
              />
              <FeatureCard
                icon={FiShoppingBag}
                label="My Orders"
                desc="Track and manage your pickup orders"
                path="/customer/orders"
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
              />
              <FeatureCard
                icon={FiHeart}
                label="Favourites"
                desc="Your saved shops and products"
                path="/customer/favourites"
                iconBg="bg-red-50"
                iconColor="text-red-500"
              />
              <FeatureCard
                icon={FiMapPin}
                label="Saved Addresses"
                desc="Manage your pickup addresses"
                path="/customer/addresses"
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
              <FeatureCard
                icon={FiTruck}
                label="Order Tracking"
                desc="Real-time status of active orders"
                path="/customer/orders"
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
              />
              <FeatureCard
                icon={FiShield}
                label="QR Pickup"
                desc="Show QR code to collect your order"
                path="/customer/orders"
                iconBg="bg-slate-50"
                iconColor="text-slate-600"
              />
            </div>

            {/* Bottom CTA */}
            <div className="border border-green-200 bg-green-50 p-5 flex items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-green-600 flex-shrink-0">
                  <FiPackage className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900">Ready to order?</p>
                  <p className="text-xs text-green-700 mt-0.5">Browse shops and add products to your cart</p>
                </div>
              </div>
              <button onClick={() => navigate('/customer/shops')}
                className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-bold transition"
              >
                Shop Now <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </CustomerShell>
  );
};

export default CustomerDashboard;
