import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiClock, FiPackage, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import RetailerShell from '../components/retailer/RetailerShell';
import StatsCard from '../components/retailer/StatsCard';
import QuickActions from '../components/retailer/QuickActions';
import RecentOrders from '../components/retailer/RecentOrders';
import AnalyticsPreview from '../components/retailer/AnalyticsPreview';
import LowStockAlerts from '../components/retailer/LowStockAlerts';
import { getDashboardStats } from '../services/dashboardService';

const Skeleton = () => (
  <div className="h-[140px] bg-[#F1F5F9] animate-pulse" />
);

const RetailerDashboard = () => {
  const { user } = useAuth();
  const [now, setNow]         = useState(new Date());
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Clock — updates every minute
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Fetch real dashboard data
  const fetchStats = () => {
    setLoading(true);
    setError('');
    getDashboardStats()
      .then(r => setStats(r))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const firstName = user?.full_name?.split(' ')[0] ?? 'there';
  const dateStr   = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr   = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const s = stats?.stats;

  const kpiCards = [
    {
      icon:  FiDollarSign,
      title: 'Total Revenue',
      value: s ? `₹${Number(s.total_revenue).toLocaleString('en-IN')}` : '₹0',
      sub:   s ? `₹${Number(s.today_revenue).toLocaleString('en-IN')} today` : undefined,
    },
    {
      icon:  FiShoppingBag,
      title: 'Total Orders',
      value: s ? String(s.total_orders) : '0',
      sub:   s ? `${s.today_orders} today` : undefined,
    },
    {
      icon:  FiClock,
      title: 'Active Orders',
      value: s ? String(s.active_orders) : '0',
      sub:   s ? `${s.completed_orders} completed` : undefined,
    },
    {
      icon:  FiPackage,
      title: 'Products',
      value: s ? String(s.total_products) : '0',
      sub:   s
        ? s.low_stock_count > 0
          ? `⚠️ ${s.low_stock_count} low stock`
          : 'All stocked'
        : undefined,
    },
  ];

  return (
    <RetailerShell>
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Welcome Banner ── */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 px-8 py-8 text-white shadow-lg"
          style={{ position: 'relative' }}
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-200">{greeting} 👋</p>
              <h1 className="mt-0.5 text-2xl font-bold text-white">{firstName}</h1>
              <p className="mt-1 text-sm text-green-100">Welcome back to your Retailer Dashboard</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs text-green-200">{dateStr}</p>
              <p className="mt-0.5 text-2xl font-bold text-white">{timeStr}</p>
              <button
                onClick={fetchStats}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-200 hover:text-white transition"
              >
                <FiRefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing…' : 'Refresh data'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            : kpiCards.map((c, i) => <StatsCard key={i} {...c} />)
          }
        </div>

        {/* ── Quick Actions ── */}
        <QuickActions />

        {/* ── Recent Orders ── */}
        <RecentOrders orders={stats?.recent_orders ?? []} />

        {/* ── Bottom grid: Analytics + Low Stock ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalyticsPreview />
          <LowStockAlerts items={stats?.low_stock_items ?? []} />
        </div>

      </div>
    </RetailerShell>
  );
};

export default RetailerDashboard;
