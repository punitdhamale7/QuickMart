import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiShoppingBag, FiClock, FiCheckCircle, FiPackage,
  FiEye, FiX, FiTruck, FiCamera, FiAlertTriangle,
  FiUser, FiDollarSign
} from 'react-icons/fi';
import RetailerShell from '../../components/retailer/RetailerShell';
import { getRetailerOrdersList, updateOrderStatusApi, verifyQrCode } from '../../services/orderService';

// ─── QR Scanner Modal ──────────────────────────────────────────────────────────
const QR_STATE = { SCANNING: 'scanning', SUCCESS: 'success', ERROR: 'error' };

const QrScannerModal = ({ onClose, onVerified }) => {
  const [scanState, setScanState] = useState(QR_STATE.SCANNING);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const [manualToken, setManualToken] = useState('');
  const [showManual, setShowManual]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const scannerRef  = useRef(null);
  const instanceRef = useRef(null);
  const scannedRef  = useRef(false); // prevent double-fire

  // Start camera scanner
  const startScanner = useCallback(async () => {
    const { Html5Qrcode } = await import('html5-qrcode');
    if (instanceRef.current) {
      try { await instanceRef.current.stop(); } catch (_) {}
      instanceRef.current = null;
    }
    const scanner = new Html5Qrcode('qr-reader-box');
    instanceRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
        (decodedText) => {
          if (!scannedRef.current) {
            scannedRef.current = true;
            handleTokenVerify(decodedText);
          }
        },
        () => {} // ignore frame errors
      );
    } catch {
      setShowManual(true); // camera not available — fall back to manual
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopScanner = useCallback(async () => {
    if (instanceRef.current) {
      try { await instanceRef.current.stop(); } catch (_) {}
      instanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    startScanner();
    return () => { stopScanner(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTokenVerify = async (token) => {
    await stopScanner();
    setLoading(true);
    try {
      const res = await verifyQrCode(token.trim());
      setScanState(QR_STATE.SUCCESS);
      setResultData(res.order);
      onVerified(); // refresh order list
    } catch (err) {
      setScanState(QR_STATE.ERROR);
      setErrorMsg(err.message || 'Invalid or unrecognised QR code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    scannedRef.current = false;
    setManualToken('');
    setErrorMsg('');
    setResultData(null);
    setScanState(QR_STATE.SCANNING);
    await startScanner();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <FiCamera className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">QR Pickup Scanner</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Point camera at customer's QR code</p>
            </div>
          </div>
          <button
            onClick={() => { stopScanner(); onClose(); }}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-6 flex flex-col items-center">

          {/* ─── SCANNING STATE ─── */}
          {scanState === QR_STATE.SCANNING && (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Camera box */}
              <div className="relative w-72 h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <div id="qr-reader-box" ref={scannerRef} className="w-full h-full" />

                {/* Corner frame overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* animated scan line */}
                  <div className="absolute left-8 right-8 h-0.5 bg-green-400/80 rounded-full animate-scan-line" />
                  {/* corners */}
                  {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
                    <div key={pos} className={`absolute w-8 h-8 ${
                      pos === 'top-left'     ? 'top-4 left-4 border-t-[3px] border-l-[3px]' :
                      pos === 'top-right'    ? 'top-4 right-4 border-t-[3px] border-r-[3px]' :
                      pos === 'bottom-left'  ? 'bottom-4 left-4 border-b-[3px] border-l-[3px]' :
                                              'bottom-4 right-4 border-b-[3px] border-r-[3px]'
                    } border-green-400 rounded-sm`} />
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white text-xs font-semibold">Verifying...</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 text-center">
                Align the customer's QR code within the frame
              </p>

              {/* Manual fallback toggle */}
              <button
                onClick={() => setShowManual(v => !v)}
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                {showManual ? 'Hide manual entry' : 'Enter token manually instead'}
              </button>

              {showManual && (
                <div className="w-full space-y-3">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={e => setManualToken(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && manualToken.trim() && handleTokenVerify(manualToken)}
                    placeholder="Paste QR token here..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    onClick={() => manualToken.trim() && handleTokenVerify(manualToken)}
                    disabled={!manualToken.trim() || loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition shadow"
                  >
                    Verify Token
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── SUCCESS STATE ─── */}
          {scanState === QR_STATE.SUCCESS && (
            <div className="w-full flex flex-col items-center gap-5 py-4 animate-fade-in">
              {/* Burst circle */}
              <div className="relative flex items-center justify-center">
                {/* Ripple rings */}
                <div className="absolute w-36 h-36 rounded-full bg-green-100 animate-ping-slow opacity-60" />
                <div className="absolute w-28 h-28 rounded-full bg-green-200 animate-ping-slow opacity-40" style={{ animationDelay: '0.15s' }} />
                {/* Icon */}
                <div className="relative w-24 h-24 flex items-center justify-center animate-pop-in">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                    {/* Circle that draws itself */}
                    <circle
                      cx="50" cy="50" r="46"
                      stroke="#22c55e"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="white"
                      className="animate-draw-circle"
                    />
                    {/* Checkmark that draws after circle */}
                    <path
                      d="M28 52 L43 67 L72 36"
                      stroke="#22c55e"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className="animate-draw-check"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xl font-black text-green-700">Pickup Verified!</h4>
                <p className="text-sm text-slate-500 mt-1">Order marked as Completed</p>
              </div>

              {resultData && (
                <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-green-800">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <FiUser className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wide">Customer</p>
                      <p className="font-bold leading-tight">{resultData.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-green-800">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <FiDollarSign className="w-3.5 h-3.5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wide">Order Total</p>
                      <p className="font-bold leading-tight">₹{Number(resultData.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex w-full gap-3 pt-1">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 border border-green-200 text-green-700 font-bold text-sm rounded-xl hover:bg-green-50 transition"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => { stopScanner(); onClose(); }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition shadow"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* ─── ERROR STATE ─── */}
          {scanState === QR_STATE.ERROR && (
            <div className="w-full flex flex-col items-center gap-5 py-4 animate-shake">
              {/* Error icon */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-red-100 animate-ping-slow opacity-50" />
                <div className="relative w-20 h-20 rounded-full bg-red-500 shadow-lg shadow-red-200 flex items-center justify-center animate-pop-in">
                  <FiAlertTriangle className="w-9 h-9 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xl font-black text-red-600">Scan Failed</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-[240px] text-center">{errorMsg}</p>
              </div>

              <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-red-600 font-semibold">
                  Make sure the order is in <strong>"Ready For Pickup"</strong> status before scanning.
                </p>
              </div>

              <div className="flex w-full gap-3 pt-1">
                <button
                  onClick={() => { stopScanner(); onClose(); }}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition shadow"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes scan-line {
          0%   { top: 20%; opacity: 1; }
          50%  { top: 75%; opacity: 0.6; }
          100% { top: 20%; opacity: 1; }
        }
        .animate-scan-line { animation: scan-line 2s ease-in-out infinite; }

        @keyframes ping-slow {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 1.4s ease-out infinite; }

        @keyframes pop-in {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.45s cubic-bezier(.34,1.56,.64,1) forwards; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.35s ease-out forwards; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }

        @keyframes draw-check {
          from { stroke-dashoffset: 60; stroke-dasharray: 60; }
          to   { stroke-dashoffset: 0;  stroke-dasharray: 60; }
        }
        .animate-draw-check { animation: draw-check 0.35s ease-out 0.5s forwards; stroke-dashoffset: 60; stroke-dasharray: 60; }

        @keyframes draw-circle {
          from { stroke-dashoffset: 289; stroke-dasharray: 289; }
          to   { stroke-dashoffset: 0;   stroke-dasharray: 289; }
        }
        .animate-draw-circle { animation: draw-circle 0.45s ease-out 0.1s forwards; stroke-dashoffset: 289; stroke-dasharray: 289; }

        /* hide html5-qrcode default UI clutter */
        #qr-reader-box > img,
        #qr-reader-box__dashboard,
        #qr-reader-box__filescan_input,
        #qr-reader-box select { display: none !important; }
        #qr-reader-box video { width: 100% !important; height: 100% !important; object-fit: cover; }
      `}</style>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Packing', 'Ready For Pickup', 'Completed', 'Declined'];

const STATUS = {
  Pending:           { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  Accepted:          { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Packing:           { bg: '#FDF4FF', color: '#A21CAF', border: '#F5D0FE' },
  'Ready For Pickup': { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  Completed:         { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' },
  Declined:          { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5' },
};

const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // QR verify state
  const [showQrModal, setShowQrModal] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await getRetailerOrdersList();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh every 4 seconds to simulate real-time updates
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus, estimatedTime = '') => {
    setUpdatingStatus(true);
    try {
      const payload = { status: newStatus };
      if (estimatedTime) {
        payload.estimated_time = estimatedTime;
      }
      const res = await updateOrderStatusApi(orderId, payload);
      if (res.success) {
        // Refresh orders and close modals
        await fetchOrders();
        setSelectedOrder(null);
        setShowTrafficModal(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openQrModal = () => setShowQrModal(true);

  const filtered = activeTab === 'All'
    ? orders
    : orders.filter(o => o.status === activeTab);

  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const activeCount = orders.filter(o => ['Accepted', 'Packing'].includes(o.status)).length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <RetailerShell>
      <Container>
        {/* Header section — 100px height */}
        <div
          className="flex items-center justify-between border-b border-[#E2E8F0]"
          style={{ height: '100px' }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Orders
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Manage and track all customer orders
            </p>
          </div>
          <button
            onClick={openQrModal}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <FiCamera className="w-4 h-4" /> Verify QR Pickup
          </button>
        </div>

        {/* Summary Cards Grid — 4 Columns, 140px height */}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: 'Total Orders', value: totalCount, icon: FiShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
            { label: 'Pending Orders', value: pendingCount, icon: FiClock, color: '#F59E0B', bg: '#FFF7ED' },
            { label: 'Active Orders', value: activeCount, icon: FiPackage, color: '#D946EF', bg: '#FDF4FF' },
            { label: 'Completed Orders', value: completedCount, icon: FiCheckCircle, color: '#10B981', bg: '#F0FDF4' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex flex-col justify-between bg-white border border-[#E2E8F0] shadow-sm transition hover:shadow-md"
              style={{ height: '140px', padding: '24px', borderRadius: '16px' }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: bg }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Filters and Table Card */}
        <div className="mt-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Tabs header */}
          <div className="flex overflow-x-auto border-b border-[#E2E8F0] px-6 gap-2 pt-3">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-shrink-0 px-4 py-3 text-sm font-semibold transition-all relative"
                style={{
                  color: activeTab === tab ? '#16A34A' : '#64748B',
                  borderBottom: activeTab === tab ? '2px solid #16A34A' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  {['Order ID', 'Customer', 'Amount', 'Time', 'Status', 'Actions'].map(h => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map(o => {
                  const badgeStyle = STATUS[o.status] || { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                      style={{ height: '60px' }}
                    >
                      <td className="px-6 py-3 font-semibold text-[#0F172A] whitespace-nowrap">#ORD-{o.id}</td>
                      <td className="px-6 py-3 text-[#334155] whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-slate-800">{o.customer_name}</p>
                          <p className="text-[11px] text-slate-400">{o.customer_phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-bold text-[#16A34A] whitespace-nowrap">₹{Number(o.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-3 text-[#64748B] whitespace-nowrap">{formatDate(o.created_at)}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color,
                            border: `1px solid ${badgeStyle.border}`,
                          }}
                        >
                          {o.status}
                        </span>
                        {o.estimated_time && (
                          <span className="block text-[10px] text-slate-400 mt-1">
                            ⏰ {o.estimated_time}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#15803D] transition-colors border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg"
                        >
                          <FiEye className="w-3.5 h-3.5" /> View &amp; Action
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FiShoppingBag className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#64748B]">No orders in this category</p>
            </div>
          )}
        </div>

        {/* Detailed View Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E2E8F0] animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">Order #ORD-{selectedOrder.id}</h2>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-[#F1F5F9] rounded-xl transition text-[#64748B]"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Customer Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-[#0F172A]">
                    <div>
                      <p className="text-xs text-slate-400">Name</p>
                      <p className="font-semibold">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="font-semibold">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Ordered</h3>
                  <div className="divide-y divide-[#E2E8F0]">
                    {selectedOrder.items?.map(item => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-slate-800">{item.product_name}</p>
                          <p className="text-xs text-slate-400">₹{Number(item.price).toFixed(2)} x {Number(item.quantity)} {item.unit_type}</p>
                        </div>
                        <p className="font-bold text-[#0F172A]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between font-bold text-base text-[#0F172A]">
                    <span>Total Amount</span>
                    <span className="text-[#16A34A]">₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Steps Tracker */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Status: {selectedOrder.status}</h3>
                  {selectedOrder.estimated_time && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-150 p-3 rounded-lg">
                      <FiClock className="w-4 h-4 shrink-0" />
                      <span>Estimated Pickup: <strong>{selectedOrder.estimated_time}</strong></span>
                    </div>
                  )}
                </div>

                {/* Actions Panel */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                  {selectedOrder.status === 'Pending' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'Declined')}
                        disabled={updatingStatus}
                        className="py-3 border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-sm rounded-xl transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => setShowTrafficModal(true)}
                        className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition shadow-md"
                      >
                        Accept Order
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === 'Accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Packing')}
                      disabled={updatingStatus}
                      className="w-full py-3 bg-[#D946EF] hover:bg-[#C026D3] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <FiPackage className="w-4 h-4" /> Start Packing
                    </button>
                  )}

                  {selectedOrder.status === 'Packing' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Ready For Pickup')}
                      disabled={updatingStatus}
                      className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <FiTruck className="w-4 h-4" /> Mark Ready for Pickup
                    </button>
                  )}

                  {selectedOrder.status === 'Ready For Pickup' && (
                    <div className="space-y-3">
                      {/* Primary — scan QR */}
                      <button
                        onClick={() => { setSelectedOrder(null); setShowQrModal(true); }}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                      >
                        <FiCamera className="w-4 h-4" /> Verify QR &amp; Complete Pickup
                      </button>
                      {/* Fallback — manual confirm without QR */}
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')}
                        disabled={updatingStatus}
                        className="w-full py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-xl transition"
                      >
                        Complete without QR scan
                      </button>
                    </div>
                  )}

                  {['Completed', 'Declined'].includes(selectedOrder.status) && (
                    <p className="text-center text-xs text-slate-400 font-medium">This order is completed/archived.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Status Selection Modal */}
        {showTrafficModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-scale-in">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <h3 className="font-bold text-slate-900 text-base">Select Shop Traffic</h3>
                <button
                  onClick={() => setShowTrafficModal(false)}
                  className="p-1 hover:bg-[#F1F5F9] rounded-lg transition text-[#64748B]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4">Choose the current shop traffic to calculate pickup availability for the customer:</p>

              <div className="space-y-3">
                {[
                  { label: 'Low Traffic', time: '10-15 mins', bg: 'hover:bg-green-50 border-green-200 text-green-700' },
                  { label: 'Medium Traffic', time: '20-30 mins', bg: 'hover:bg-blue-50 border-blue-200 text-blue-700' },
                  { label: 'High Traffic', time: '45-60 mins', bg: 'hover:bg-orange-50 border-orange-200 text-orange-700' },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Accepted', `${opt.time} (${opt.label})`)}
                    disabled={updatingStatus}
                    className={`w-full text-left p-3.5 border rounded-xl font-bold transition flex items-center justify-between text-sm ${opt.bg}`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-xs font-normal opacity-90">{opt.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QR Verification Modal */}
        {showQrModal && (
          <QrScannerModal
            onClose={() => setShowQrModal(false)}
            onVerified={fetchOrders}
          />
        )}
      </Container>
    </RetailerShell>
  );
};

export default Orders;
