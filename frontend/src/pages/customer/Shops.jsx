import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerShell from '../../components/customer/CustomerShell';
import { getAllShops } from '../../services/customerService';
import {
  FiSearch, FiMapPin, FiClock, FiPhone,
  FiArrowRight, FiShoppingBag, FiRefreshCw,
} from 'react-icons/fi';

const Shops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const load = (q = '') => {
    setLoading(true);
    getAllShops(q ? { search: q } : {})
      .then(r => setShops(r.shops))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // Refresh shop statuses every 30s
    const poll = setInterval(() => load(search), 30000);
    return () => clearInterval(poll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    load(searchInput);
  };

  const fmt = (t) => t ? t.slice(0, 5) : '';

  return (
    <CustomerShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Browse Shops</h1>
          <p className="text-sm text-slate-500 mt-1">Discover local grocery stores near you</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search shops by name, area…"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          <button type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); load(); }}
              className="px-4 py-3 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4" /> Clear
            </button>
          )}
        </form>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FiShoppingBag className="w-14 h-14 text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-700 mb-1">No shops found</h3>
            <p className="text-sm text-slate-400">Try a different search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shops.map(shop => (
              <div key={shop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/customer/shop/${shop.id}`)}
              >
                {/* Shop Cover Photo or Fallback Header */}
                {shop.shop_image ? (
                  <div className="h-32 w-full overflow-hidden border-b border-slate-100 relative">
                    <img
                      src={`http://localhost:5000${shop.shop_image}`}
                      alt={shop.shop_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white/90">
                    <FiShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                )}

                <div className="p-5">
                  {/* Name + status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white font-extrabold text-lg flex-shrink-0 shadow-sm">
                        {shop.shop_name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{shop.shop_name}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{shop.area}, {shop.city}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      shop.shop_status === 'open'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${shop.shop_status === 'open' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {shop.shop_status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Description */}
                  {shop.shop_description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{shop.shop_description}</p>
                  )}

                  {/* Info rows */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{shop.address}, {shop.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FiClock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{fmt(shop.opening_time)} – {fmt(shop.closing_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FiPhone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{shop.contact_number}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">
                      {shop.product_count} product{shop.product_count !== 1 ? 's' : ''} available
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
                      Browse <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerShell>
  );
};

export default Shops;
