import { useNavigate } from 'react-router-dom';

const STATUS_STYLE = {
  pending:          { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA', label: 'Pending'          },
  accepted:         { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', label: 'Accepted'         },
  packing:          { bg: '#FDF4FF', color: '#A21CAF', border: '#F5D0FE', label: 'Packing'          },
  ready_for_pickup: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', label: 'Ready for Pickup' },
  completed:        { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', label: 'Completed'        },
};

const Badge = ({ status }) => {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
};

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const COLS = ['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Action'];

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6" style={{ height: '64px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Recent Orders</h2>
        <button
          onClick={() => navigate('/retailer/orders')}
          style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}
          className="transition hover:text-green-700"
        >
          View all →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '640px' }}>
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {COLS.map(h => (
                <th key={h} className="px-6 text-left whitespace-nowrap"
                  style={{ height: '44px', fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center"
                  style={{ fontSize: '14px', color: '#64748B' }}>
                  No orders yet. Share your shop with customers!
                </td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={o.id}
                  className="border-b border-[#E2E8F0] last:border-0 transition hover:bg-[#F8FAFC]"
                  style={{ height: '60px' }}>
                  <td className="px-6" style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                    #ORD-{String(o.id).padStart(4, '0')}
                  </td>
                  <td className="px-6" style={{ fontSize: '14px', color: '#0F172A', whiteSpace: 'nowrap' }}>{o.customer_name}</td>
                  <td className="px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                    ₹{Number(o.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6"><Badge status={o.status} /></td>
                  <td className="px-6" style={{ fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{fmt(o.created_at)}</td>
                  <td className="px-6">
                    <button style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}
                      className="transition hover:text-green-700">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
