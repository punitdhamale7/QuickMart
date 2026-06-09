import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiPackage, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import RetailerShell from '../../components/retailer/RetailerShell';
import { getAnalyticsData } from '../../services/dashboardService';

const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const fmt = (n) => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(1) + 'k';
  return '₹' + Number(n).toFixed(0);
};

const fmtShort = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};

// ── Skeleton loader ────────────────────────────────────────────────────────────
const Skeleton = ({ h = '140px', rounded = '16px' }) => (
  <div className="animate-pulse bg-slate-100" style={{ height: h, borderRadius: rounded }} />
);

const Analytics = () => {
  const [period, setPeriod]   = useState('weekly');
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAnalyticsData();
        if (res.success) setData(res);
        else setError(res.message);
      } catch (e) {
        setError(e.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Chart data
  const chartData = data ? (period === 'weekly' ? data.daily : data.monthly) : [];
  const xKey      = period === 'weekly' ? 'day' : 'm';
  const maxVal    = chartData.length ? Math.max(...chartData.map(d => d.sales), 1) : 1;

  // KPI config
  const kpis = data ? [
    {
      icon: FiDollarSign,
      label: 'Total Revenue',
      value: fmt(data.kpis.total_revenue),
      change: data.kpis.revenue_change,
      up: !data.kpis.revenue_change.startsWith('-'),
    },
    {
      icon: FiShoppingBag,
      label: 'Total Orders',
      value: fmtShort(data.kpis.total_orders),
      change: data.kpis.orders_change,
      up: !data.kpis.orders_change.startsWith('-'),
    },
    {
      icon: FiTrendingUp,
      label: 'Avg Order Value',
      value: fmt(data.kpis.avg_order_value),
      change: data.kpis.avg_change,
      up: !data.kpis.avg_change.startsWith('-'),
    },
    {
      icon: FiPackage,
      label: 'Products Sold',
      value: fmtShort(data.kpis.products_sold),
      change: data.kpis.sold_change,
      up: !data.kpis.sold_change.startsWith('-'),
    },
  ] : [];

  return (
    <RetailerShell>
      <Container>

        {/* Page title */}
        <div className="border-b border-[#E2E8F0] pb-6">
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A' }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
            Track shop performance and sales trends.
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            : kpis.map(({ icon: Icon, label, value, change, up }) => (
              <div
                key={label}
                className="flex flex-col justify-between bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition"
                style={{ height: '140px', padding: '24px', borderRadius: '16px' }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{label}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC]">
                    <Icon className="h-4 w-4 text-[#64748B]" />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{value}</p>
                  <p className="flex items-center gap-1 mt-1.5" style={{ fontSize: '12px', fontWeight: 600, color: up ? '#22C55E' : '#EF4444' }}>
                    {up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                    {change} vs last month
                  </p>
                </div>
              </div>
            ))
          }
        </div>

        {/* ── Sales Chart ── */}
        <div
          className="mt-8 flex flex-col rounded-2xl border border-[#E2E8F0] bg-white"
          style={{ height: '450px', padding: '24px' }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Sales Overview</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                {period === 'weekly' ? 'Last 7 days' : 'Last 6 months'}
              </p>
            </div>
            <div className="flex gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {['weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="capitalize transition"
                  style={{
                    height: '32px', padding: '0 16px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: 600,
                    background: period === p ? '#fff' : 'transparent',
                    color: period === p ? '#0F172A' : '#64748B',
                    boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-end gap-3">
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full animate-pulse bg-slate-100 rounded-md" style={{ height: `${30 + Math.random() * 50}%` }} />
                  <div className="w-8 h-3 animate-pulse bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : chartData.every(d => d.sales === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <FiShoppingBag className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-semibold">No completed orders yet</p>
              <p className="text-xs mt-1">Revenue will appear here once orders are completed</p>
            </div>
          ) : (
            <div className="flex flex-1 items-end gap-3">
              {chartData.map((d) => {
                const pct = maxVal > 0 ? (d.sales / maxVal) * 100 : 0;
                return (
                  <div key={d[xKey]} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="invisible text-[11px] font-semibold text-[#64748B] group-hover:visible whitespace-nowrap">
                      {fmt(d.sales)}
                    </span>
                    <div className="relative w-full overflow-hidden rounded-md" style={{ flex: 1, background: '#F1F5F9' }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-md transition-all duration-500 group-hover:opacity-80"
                        style={{ height: `${pct}%`, background: pct > 0 ? 'linear-gradient(to top, #16A34A, #22C55E)' : 'transparent' }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>{d[xKey]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Top Products ── */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white mb-8">
          <div className="border-b border-[#E2E8F0] px-6" style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Top Selling Products</h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} h="52px" rounded="10px" />)}
            </div>
          ) : !data?.top_products?.length ? (
            <div className="py-16 text-center">
              <FiPackage className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">No completed orders yet</p>
              <p className="text-xs text-slate-400 mt-1">Top products will appear here once orders are completed</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {['#', 'Product', 'Units Sold', 'Revenue', 'Share'].map((h) => (
                    <th key={h} className="px-6 text-left whitespace-nowrap"
                      style={{ height: '44px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.top_products.map(({ name, sold, revenue, pct }, i) => (
                  <tr key={name} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition"
                    style={{ height: '60px' }}>
                    <td className="px-6">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0FDF4] text-[11px] font-bold text-[#16A34A]">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6" style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{name}</td>
                    <td className="px-6" style={{ fontSize: '14px', color: '#64748B' }}>{sold}</td>
                    <td className="px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{fmt(revenue)}</td>
                    <td className="px-6" style={{ minWidth: '160px' }}>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div className="h-full rounded-full bg-[#16A34A] transition-all duration-700"
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', minWidth: '32px' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </Container>
    </RetailerShell>
  );
};

export default Analytics;
