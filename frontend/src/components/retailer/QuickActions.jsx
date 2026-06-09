import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiShoppingBag, FiBox } from 'react-icons/fi';

/**
 * QuickActions — horizontal row of 4 buttons
 * Each button: height 48px, width 180px  (spec)
 */
const ACTIONS = [
  { icon: FiPlus,        label: 'Add Product',     path: '/retailer/add-product'     },
  { icon: FiEdit2,       label: 'Manage Products', path: '/retailer/manage-products' },
  { icon: FiShoppingBag, label: 'Orders',          path: '/retailer/orders'          },
  { icon: FiBox,         label: 'Inventory',       path: '/retailer/inventory'       },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white" style={{ padding: '24px' }}>
      <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748B', marginBottom: '16px' }}>
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-3">
        {ACTIONS.map(({ icon: Icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex items-center justify-center gap-2 border border-[#E2E8F0] bg-white text-[14px] font-semibold text-[#0F172A] transition hover:border-[#16A34A] hover:text-[#16A34A] active:scale-[0.97]"
            style={{ height: '48px', width: '180px', borderRadius: '12px' }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
