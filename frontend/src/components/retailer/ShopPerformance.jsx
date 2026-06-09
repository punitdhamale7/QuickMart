import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiStar } from 'react-icons/fi';

const metrics = [
  { icon: FiShoppingBag, label: "Today's Orders",   value: '28',      sub: '+3 vs yesterday', bg: 'bg-blue-50',   border: 'border-blue-100',   color: 'text-blue-600'   },
  { icon: FiDollarSign,  label: "Today's Revenue",  value: 'Rs. 12,450', sub: '+18% this week',  bg: 'bg-green-50',  border: 'border-green-100',  color: 'text-green-600'  },
  { icon: FiTrendingUp,  label: 'Avg Order Value',  value: 'Rs. 445',    sub: 'Per completed order', bg: 'bg-purple-50', border: 'border-purple-100', color: 'text-purple-600' },
  { icon: FiStar,        label: 'Customer Rating',  value: '4.8 / 5',  sub: 'Based on 340 reviews', bg: 'bg-yellow-50', border: 'border-yellow-100', color: 'text-yellow-600' },
];

const ShopPerformance = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-1">
      <h2 className="text-sm font-bold text-gray-900">Shop Performance</h2>
      <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">Today</span>
    </div>
    <p className="text-xs text-gray-400 mb-5">Key metrics for your store this session</p>

    <div className="grid grid-cols-2 gap-3">
      {metrics.map(({ icon: Icon, label, value, sub, bg, border, color }) => (
        <div
          key={label}
          className={`${bg} border ${border} rounded-xl p-4 flex flex-col gap-2.5`}
        >
          <div className={`w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color} ${Icon === FiStar ? 'fill-yellow-500 text-yellow-600' : ''}`} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-tight">{label}</p>
            <p className="text-base font-black text-gray-900 mt-1 leading-none">{value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopPerformance;
