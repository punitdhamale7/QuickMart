import { FiClock, FiCheckCircle, FiPackage, FiShoppingBag, FiCheck } from 'react-icons/fi';

const stages = [
  { icon: FiClock,       label: 'Pending',          count: 5,  color: 'text-yellow-600', bg: 'bg-yellow-50',  dot: 'bg-yellow-400' },
  { icon: FiCheckCircle, label: 'Accepted',          count: 8,  color: 'text-blue-600',   bg: 'bg-blue-50',    dot: 'bg-blue-400'   },
  { icon: FiPackage,     label: 'Packing',           count: 12, color: 'text-orange-600', bg: 'bg-orange-50',  dot: 'bg-orange-400' },
  { icon: FiShoppingBag, label: 'Ready for Pickup',  count: 7,  color: 'text-green-600',  bg: 'bg-green-50',   dot: 'bg-green-500'  },
  { icon: FiCheck,       label: 'Completed',         count: 48, color: 'text-gray-500',   bg: 'bg-gray-50',    dot: 'bg-gray-400'   },
];

const total = stages.reduce((s, i) => s + i.count, 0);

const OrderStatusFlow = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h2 className="text-sm font-bold text-gray-900 mb-0.5">Order Pipeline</h2>
    <p className="text-xs text-gray-400 mb-4">Live counts by status</p>

    <div className="space-y-2">
      {stages.map(({ icon: Icon, label, count, color, bg, dot }, idx) => (
        <div key={label}>
          <div className={`flex items-center justify-between ${bg} rounded-xl px-4 py-3`}>
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dot} rounded-full`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-5 text-right">{count}</span>
            </div>
          </div>
          {idx < stages.length - 1 && (
            <div className="flex justify-center my-0.5">
              <div className="w-px h-3 bg-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Total */}
    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xs font-medium text-gray-500">Total today</span>
      <span className="text-sm font-black text-gray-900">{total} orders</span>
    </div>
  </div>
);

export default OrderStatusFlow;
