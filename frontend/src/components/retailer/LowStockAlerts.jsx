import { FiAlertTriangle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LowStockAlerts = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E2E8F0] shadow-sm" style={{ padding: '24px' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Low Stock</h2>
        {items.length > 0 && (
          <div className="flex items-center gap-1.5">
            <FiAlertTriangle className="h-3.5 w-3.5 text-[#EF4444]" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>
              {items.length} items
            </span>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FiCheckCircle className="h-8 w-8 text-green-500 mb-2" />
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>All stock levels are healthy</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const critical = Number(item.stock_quantity) < 5;
            return (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5"
                style={{
                  borderLeft: `3px solid ${critical ? '#EF4444' : '#F59E0B'}`,
                  background: critical ? '#FFF5F5' : '#FFFBEB',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{item.product_name}</p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: critical ? '#EF4444' : '#F59E0B', whiteSpace: 'nowrap' }}>
                  {item.stock_quantity} {item.unit_type}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/retailer/inventory')}
        className="mt-4 flex w-full items-center justify-center gap-1.5 border border-[#E2E8F0] py-2 transition hover:bg-[#F8FAFC]"
        style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}
      >
        Manage Inventory <FiArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default LowStockAlerts;
