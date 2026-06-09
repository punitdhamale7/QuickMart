import { useState, useEffect } from 'react';
import CustomerShell from '../../components/customer/CustomerShell';
import { getCustomerOrdersList } from '../../services/orderService';
import { QRCodeSVG } from 'qrcode.react';
import {
  FiShoppingBag, FiClock, FiCheckCircle, FiPackage,
  FiAlertCircle, FiMapPin, FiTruck, FiX
} from 'react-icons/fi';

const STATUS_BADGES = {
  Pending:           { label: 'Waiting for acceptance', bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  Accepted:          { label: 'Accepted & Preparing', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  Packing:           { label: 'Packing items', bg: '#FDF4FF', text: '#A21CAF', border: '#F5D0FE' },
  'Ready For Pickup': { label: 'Ready for pickup', bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  Completed:         { label: 'Completed', bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  Declined:          { label: 'Declined', bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
};

const OrderRemainingTime = ({ createdAt, estimatedTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    let durationMins = 15; // default
    if (estimatedTime) {
      // Look for range e.g., "10-15 mins"
      const rangeMatch = estimatedTime.match(/-\s*(\d+)\s*mins?/);
      if (rangeMatch) {
        durationMins = parseInt(rangeMatch[1], 10);
      } else {
        const singleMatch = estimatedTime.match(/(\d+)\s*mins?/);
        if (singleMatch) {
          durationMins = parseInt(singleMatch[1], 10);
        }
      }
    }

    const createdTime = new Date(createdAt).getTime();
    const endTime = createdTime + durationMins * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft('Time reached');
        return;
      }

      const mins = Math.floor(diff / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);
      setTimeLeft(`${mins}m ${secs}s left`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt, estimatedTime]);

  return (
    <span className="font-mono text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping" />
      {timeLeft}
    </span>
  );
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrOrder, setQrOrder] = useState(null); // order whose QR is being shown

  const fetchOrders = async () => {
    try {
      const res = await getCustomerOrdersList();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll orders list status changes
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <CustomerShell>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Orders</h1>
        <p className="text-sm text-slate-500 mb-8">Track and manage your grocery pickup orders</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FiShoppingBag className="w-14 h-14 text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-700 mb-1">No orders yet</h3>
            <p className="text-sm text-slate-400">Browse shops and place your first order!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const badge = STATUS_BADGES[order.status] || { label: order.status, bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
              const showTimer = ['Accepted', 'Packing'].includes(order.status) && order.estimated_time;

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row justify-between">
                  
                  {/* Left Main Details */}
                  <div className="p-6 flex-1 space-y-4">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-lg">#ORD-{order.id}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
                        >
                          {badge.label}
                        </span>
                        {showTimer && (
                          <OrderRemainingTime createdAt={order.created_at} estimatedTime={order.estimated_time} />
                        )}
                      </div>
                    </div>

                    {/* Shop details */}
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <FiMapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800">{order.shop_name}</p>
                        <p className="text-xs text-slate-500">{order.area}, {order.city}</p>
                      </div>
                    </div>

                    {/* Items preview list */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Items</p>
                      <div className="grid grid-cols-1 gap-1 pl-1">
                        {order.items?.map(item => (
                          <div key={item.id} className="text-xs text-slate-600 flex items-center justify-between">
                            <span>{item.product_name} <strong className="text-slate-400">x {Number(item.quantity)} {item.unit_type}</strong></span>
                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side Summary Panel */}
                  <div className="p-6 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between items-stretch md:w-64 text-center md:text-right">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtotal</span>
                      <p className="text-2xl font-black text-green-700 mt-1">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>

                    <div className="mt-4 md:mt-0 text-center">
                      {order.status === 'Ready For Pickup' && (
                        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-xl flex flex-col items-center gap-1.5">
                          <FiTruck className="w-5 h-5 animate-bounce" />
                          <p className="text-xs font-bold">Ready to Collect!</p>
                          <button
                            onClick={() => setQrOrder(order)}
                            className="mt-1 text-[11px] font-bold bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 transition"
                          >
                            Show QR Code
                          </button>
                        </div>
                      )}
                      {order.status === 'Pending' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex items-center gap-2 justify-center">
                          <FiClock className="w-4 h-4 animate-spin" />
                          <p className="text-[11px] font-semibold">Waiting acceptance...</p>
                        </div>
                      )}
                      {order.status === 'Accepted' && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl flex flex-col items-center gap-1 text-xs">
                          <p className="font-bold">Estimated Pickup</p>
                          <p className="font-black text-sm">{order.estimated_time?.split(' (')[0] || order.estimated_time}</p>
                        </div>
                      )}
                      {order.status === 'Packing' && (
                        <div className="bg-purple-50 border border-purple-200 text-purple-800 p-3 rounded-xl flex flex-col items-center gap-1 text-xs">
                          <p className="font-bold">Status: Packing</p>
                          <p className="text-[10px] opacity-90">Shopkeeper is packing your items now.</p>
                        </div>
                      )}
                      {order.status === 'Completed' && (
                        <div className="bg-slate-100 border border-slate-200 text-slate-700 p-2.5 rounded-xl flex items-center gap-1.5 justify-center text-xs font-bold">
                          <FiCheckCircle className="w-4 h-4 text-green-600" /> Pickup Completed
                        </div>
                      )}
                      {order.status === 'Declined' && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl flex items-center gap-1.5 justify-center text-xs font-bold">
                          <FiAlertCircle className="w-4 h-4" /> Order Declined
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center border border-slate-100">
            <div className="flex w-full justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pickup QR Code</h2>
                <p className="text-xs text-slate-400 mt-0.5">#ORD-{qrOrder.id} · {qrOrder.shop_name}</p>
              </div>
              <button
                onClick={() => setQrOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-2xl p-4 shadow-inner">
              <QRCodeSVG
                value={qrOrder.qr_token}
                size={200}
                bgColor="#ffffff"
                fgColor="#15803d"
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-xs text-slate-500 mt-5 text-center leading-relaxed">
              Show this QR code to the shopkeeper at <strong>{qrOrder.shop_name}</strong> to complete your pickup.
            </p>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Token</p>
              <p className="text-xs font-mono text-slate-600 break-all mt-0.5">{qrOrder.qr_token}</p>
            </div>
          </div>
        </div>
      )}
    </CustomerShell>
  );
};

export default CustomerOrders;
