import {
  FiBell, FiShoppingBag, FiCheckCircle,
  FiAlertTriangle, FiDollarSign, FiArrowRight,
} from 'react-icons/fi';

const notifications = [
  {
    icon: FiShoppingBag,
    title: 'New Order Received',
    desc:  'Order #ORD-1239 placed by Ravi Kumar',
    time:  '2 min ago',
    unread: true,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: FiCheckCircle,
    title: 'Order Ready for Pickup',
    desc:  'Order #ORD-1235 is packed and ready',
    time:  '15 min ago',
    unread: true,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: FiAlertTriangle,
    title: 'Low Stock Alert',
    desc:  'Rice stock is running low — only 4 KG left',
    time:  '1 hr ago',
    unread: false,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: FiDollarSign,
    title: 'Payment Confirmed',
    desc:  'Rs. 1,250 received for Order #ORD-1234',
    time:  '2 hrs ago',
    unread: false,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const unreadCount = notifications.filter((n) => n.unread).length;

const NotificationsPanel = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
          <FiBell className="w-4 h-4 text-gray-600" />
        </div>
        <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
      </div>
      {unreadCount > 0 && (
        <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
    <p className="text-xs text-gray-400 mb-4 ml-10">Recent activity from your store</p>

    <div className="space-y-2">
      {notifications.map(({ icon: Icon, title, desc, time, unread, iconBg, iconColor }) => (
        <div
          key={title + time}
          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
            unread
              ? 'bg-green-50/50 border-green-100 hover:bg-green-50'
              : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}
        >
          <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-gray-800 leading-snug">{title}</p>
              {unread && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">{time}</p>
          </div>
        </div>
      ))}
    </div>

    <button className="w-full mt-4 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-50 rounded-xl transition-colors">
      View all notifications
      <FiArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default NotificationsPanel;
