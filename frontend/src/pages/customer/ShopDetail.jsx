import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerShell from '../../components/customer/CustomerShell';
import { getShopById, getShopProducts } from '../../services/customerService';
import { placeOrder, getOrderDetails } from '../../services/orderService';
import {
  FiArrowLeft, FiSearch, FiShoppingCart,
  FiMapPin, FiClock, FiPhone, FiPackage,
  FiPlus, FiMinus, FiX,
} from 'react-icons/fi';

const UNIT_LABELS = { kg: 'KG', gram: 'g', liter: 'L', piece: 'pc', packet: 'pkt' };

const Cart = ({ cart, onUpdate, onRemove, onClose, onCheckout, shopName }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex flex-col bg-white w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Your Cart</h2>
            <p className="text-xs text-slate-500">{shopName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiShoppingCart className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-500">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-1">Add products from the shop</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.product_name}</p>
                  <p className="text-xs text-slate-500">₹{Number(item.price).toFixed(2)} / {UNIT_LABELS[item.unit_type]}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => onUpdate(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-slate-900">{item.qty}</span>
                  <button onClick={() => onUpdate(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                    <FiPlus className="w-3 h-3" />
                  </button>
                  <button onClick={() => onRemove(item.id)} className="ml-1 text-red-400 hover:text-red-600 transition">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Subtotal</span>
              <span className="text-lg font-bold text-slate-900">₹{total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition text-sm">
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-slate-400 text-center">Pickup order — collect from store</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null); // 'placing', 'waiting', 'accepted', 'declined', 'error'
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Handle proceed to checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    setCheckoutStatus('placing');
    setCheckoutError('');
    setShowCart(false);

    try {
      const res = await placeOrder({
        shop_id: shop.id,
        total_amount: total,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.qty,
          unit_type: item.unit_type
        }))
      });

      if (res.success) {
        setPlacedOrderId(res.order_id);
        setCheckoutStatus('waiting');
      } else {
        setCheckoutStatus('error');
        setCheckoutError(res.message || 'Failed to place order');
      }
    } catch (err) {
      setCheckoutStatus('error');
      setCheckoutError(err.message || 'An error occurred during checkout');
    }
  };

  // Poll for order status
  useEffect(() => {
    if (checkoutStatus !== 'waiting' || !placedOrderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getOrderDetails(placedOrderId);
        if (res.success && res.order) {
          const status = res.order.status;
          if (status === 'Accepted' || status === 'Packing' || status === 'Ready For Pickup' || status === 'Completed') {
            setEstimatedTime(res.order.estimated_time);
            setCheckoutStatus('accepted');
            setCart([]); // Clear cart on success
            clearInterval(interval);
          } else if (status === 'Declined') {
            setCheckoutStatus('declined');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [checkoutStatus, placedOrderId]);

  useEffect(() => {
    Promise.all([getShopById(shopId), getShopProducts(shopId)])
      .then(([s, p]) => { setShop(s.shop); setProducts(p.products); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Refresh shop status every 30 seconds so open/closed reflects live
    const poll = setInterval(() => {
      getShopById(shopId)
        .then(s => setShop(s.shop))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(poll);
  }, [shopId]);

  // Live search
  useEffect(() => {
    if (!shopId) return;
    getShopProducts(shopId, search ? { search } : {})
      .then(r => setProducts(r.products))
      .catch(() => {});
  }, [search, shopId]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const getQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  const fmt = (t) => t ? t.slice(0, 5) : '';

  if (loading) return (
    <CustomerShell>
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    </CustomerShell>
  );

  if (!shop) return (
    <CustomerShell>
      <div className="text-center py-32">
        <p className="text-slate-500">Shop not found.</p>
        <button onClick={() => navigate('/customer/shops')} className="mt-4 text-green-600 font-semibold text-sm">
          ← Back to Shops
        </button>
      </div>
    </CustomerShell>
  );

  return (
    <CustomerShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>

        {/* Back */}
        <button onClick={() => navigate('/customer/shops')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition mb-5">
          <FiArrowLeft className="w-4 h-4" /> Back to Shops
        </button>

        {/* Shop Header */}
        <div 
          className="rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden bg-cover bg-center"
          style={{ 
            backgroundImage: shop.shop_image 
              ? `linear-gradient(to bottom, rgba(22, 163, 74, 0.4), rgba(22, 101, 52, 0.95)), url(http://localhost:5000${shop.shop_image})` 
              : 'linear-gradient(to bottom right, #16a34a, #166534)'
          }}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-extrabold flex-shrink-0">
                {shop.shop_name[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold">{shop.shop_name}</h1>
                {shop.shop_description && (
                  <p className="text-sm text-green-100 mt-0.5">{shop.shop_description}</p>
                )}
                <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  shop.shop_status === 'open' ? 'bg-white/20 text-white' : 'bg-red-500/30 text-red-100'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${shop.shop_status === 'open' ? 'bg-green-300' : 'bg-red-300'}`} />
                  {shop.shop_status === 'open' ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-green-100 sm:text-right">
              <p className="flex items-center gap-2 sm:justify-end"><FiMapPin className="w-3.5 h-3.5" />{shop.area}, {shop.city}</p>
              <p className="flex items-center gap-2 sm:justify-end"><FiClock className="w-3.5 h-3.5" />{fmt(shop.opening_time)} – {fmt(shop.closing_time)}</p>
              <p className="flex items-center gap-2 sm:justify-end"><FiPhone className="w-3.5 h-3.5" />{shop.contact_number}</p>
            </div>
          </div>
        </div>

        {/* Search + Cart bar */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products in this shop…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition"
          >
            <FiShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeCategory === cat
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FiPackage className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => {
              const qty = getQty(product.id);
              const imgSrc = product.product_image
                ? `http://localhost:5000${product.product_image}`
                : null;

              return (
                <div key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">

                  {/* Image */}
                  <div className="w-full h-36 bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imgSrc
                      ? <img src={imgSrc} alt={product.product_name} className="w-full h-full object-cover" />
                      : <FiPackage className="w-10 h-10 text-slate-300" />
                    }
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-0.5 line-clamp-2">
                      {product.product_name}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-2">{product.category}</p>

                    <div className="flex items-center justify-between mb-3 mt-auto">
                      <p className="text-base font-bold text-green-700">
                        ₹{Number(product.price).toFixed(2)}
                        <span className="text-[11px] text-slate-400 font-normal ml-1">
                          / {UNIT_LABELS[product.unit_type]}
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>

                    {/* Add to cart */}
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <FiPlus className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
                        <button onClick={() => updateQty(product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-green-700">{qty}</span>
                        <button onClick={() => updateQty(product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <Cart
          cart={cart}
          onUpdate={updateQty}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
          shopName={shop.shop_name}
        />
      )}

      {/* Checkout Status Modal */}
      {checkoutStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-scale-in">
            {checkoutStatus === 'placing' && (
              <div className="space-y-4 py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">Placing Order</h3>
                <p className="text-sm text-slate-500">Please wait while we connect with the shop...</p>
              </div>
            )}

            {checkoutStatus === 'waiting' && (
              <div className="space-y-5 py-2">
                <div className="relative flex items-center justify-center h-20 w-20 mx-auto">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 animate-ping" />
                  <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-400 opacity-30 animate-pulse" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold text-xl shadow-lg">
                    Q
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Waiting for Acceptance</h3>
                  <p className="text-sm text-slate-500 mt-1">Order placed successfully! We've sent your request to <strong className="text-green-700">{shop.shop_name}</strong>.</p>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 py-2 rounded-lg border border-slate-100">Waiting for shopkeeper to confirm pickup time...</p>
                </div>
              </div>
            )}

            {checkoutStatus === 'accepted' && (
              <div className="space-y-5 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto border-2 border-green-200">
                  <svg className="w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Order Accepted! 🎉</h3>
                  <p className="text-sm text-slate-500 mt-1">Your order at <strong>{shop.shop_name}</strong> is confirmed.</p>
                  
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Estimated Pickup Time</p>
                    <p className="text-2xl font-black text-green-700 mt-1">{estimatedTime || '10-15 mins'}</p>
                    <p className="text-[10px] text-green-600 mt-1 font-semibold">Based on current shop traffic status</p>
                  </div>
                </div>
                <button
                  onClick={() => { setCheckoutStatus(null); setPlacedOrderId(null); }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                >
                  Awesome!
                </button>
              </div>
            )}

            {checkoutStatus === 'declined' && (
              <div className="space-y-5 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto border-2 border-red-200">
                  <FiX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Order Declined</h3>
                  <p className="text-sm text-slate-500 mt-1">Unfortunately, the shop has declined your order request at this time.</p>
                </div>
                <button
                  onClick={() => { setCheckoutStatus(null); setPlacedOrderId(null); }}
                  className="w-full py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm"
                >
                  Close
                </button>
              </div>
            )}

            {checkoutStatus === 'error' && (
              <div className="space-y-5 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mx-auto border-2 border-orange-200">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Checkout Error</h3>
                  <p className="text-sm text-slate-500 mt-1">{checkoutError || 'An error occurred.'}</p>
                </div>
                <button
                  onClick={() => { setCheckoutStatus(null); }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </CustomerShell>
  );
};

export default ShopDetail;
