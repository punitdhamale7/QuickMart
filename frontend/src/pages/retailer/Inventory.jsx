import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage, FiCheckCircle, FiAlertTriangle, FiXCircle,
  FiRefreshCw, FiPlus, FiEdit2,
} from 'react-icons/fi';
import RetailerShell from '../../components/retailer/RetailerShell';
import { getInventory } from '../../services/productService';

/* Shared container */
const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

/* Status badge */
const STATUS_CFG = {
  available:    { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', label: 'Available'    },
  low_stock:    { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', label: 'Low Stock'    },
  out_of_stock: { bg: '#FFF5F5', color: '#B91C1C', border: '#FECACA', label: 'Out of Stock' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CFG[status] ?? STATUS_CFG.available;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600,
    }}>
      {s.label}
    </span>
  );
};

const Inventory = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getInventory().then((r) => setData(r)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const summary = data?.summary ?? {};
  const items   = data?.all_items ?? data?.low_stock_items ?? [];

  const SUMMARY_CARDS = [
    { icon: FiPackage,      label: 'Total Products',  value: summary.total       ?? 0, color: '#64748B' },
    { icon: FiCheckCircle,  label: 'Available',       value: summary.available   ?? 0, color: '#16A34A' },
    { icon: FiAlertTriangle,label: 'Low Stock',       value: summary.low_stock   ?? 0, color: '#F59E0B' },
    { icon: FiXCircle,      label: 'Out of Stock',    value: summary.out_of_stock ?? 0, color: '#EF4444' },
  ];

  return (
    <RetailerShell>
      <Container>

        {/* Page header */}
        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A' }}>Inventory</h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
              Monitor stock levels across all products.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={load}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white transition hover:bg-[#F8FAFC]"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px', fontWeight: 600, color: '#64748B' }}
            >
              <FiRefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => navigate('/retailer/add-product')}
              className="flex items-center gap-2 rounded-xl bg-[#16A34A] text-white transition hover:bg-green-700"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px', fontWeight: 600 }}
            >
              <FiPlus className="h-4 w-4" /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E2E8F0] border-b-[#16A34A]" />
          </div>
        ) : (
          <>
            {/* ── 3 (/ 4) Summary Cards ── */}
            <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {SUMMARY_CARDS.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col justify-between bg-white border border-[#E2E8F0] shadow-sm"
                  style={{ height: '140px', padding: '24px', borderRadius: '16px' }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{label}</span>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Inventory Table ── */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6" style={{ height: '64px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>All Products</h2>
                <button
                  onClick={() => navigate('/retailer/manage-products')}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white transition hover:bg-[#F8FAFC]"
                  style={{ height: '36px', padding: '0 12px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}
                >
                  <FiEdit2 className="h-3.5 w-3.5" /> Manage
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FiCheckCircle className="h-12 w-12 text-[#22C55E]" />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginTop: '12px' }}>
                    All stock levels healthy
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
                    No products are running low right now.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        {['Product', 'Stock', 'Unit', 'Status', 'Action'].map((h) => (
                          <th key={h} className="px-6 text-left whitespace-nowrap"
                            style={{ height: '44px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const st = item.stock_quantity <= 0 ? 'out_of_stock'
                                 : item.stock_quantity <= 10 ? 'low_stock'
                                 : 'available';
                        return (
                          <tr key={item.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition"
                            style={{ height: '60px' }}>
                            <td className="px-6" style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>
                              {item.product_name}
                            </td>
                            <td className="px-6" style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                              {item.stock_quantity}
                            </td>
                            <td className="px-6" style={{ fontSize: '14px', color: '#64748B' }}>
                              {item.unit_type}
                            </td>
                            <td className="px-6"><StatusBadge status={st} /></td>
                            <td className="px-6">
                              <button
                                onClick={() => navigate('/retailer/manage-products')}
                                style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}
                                className="transition hover:text-green-700"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </Container>
    </RetailerShell>
  );
};

export default Inventory;
