import { useState, useMemo } from 'react';
import {
  FiX, FiSearch, FiPlus, FiCheck, FiShoppingBag,
} from 'react-icons/fi';
import GROCERY_CATALOG from '../../data/groceryCatalog';
import { addProduct } from '../../services/productService';

const CATEGORIES = ['All', ...new Set(GROCERY_CATALOG.map(p => p.category))];

const UNIT_LABELS = { kg: 'KG', gram: 'g', liter: 'L', piece: 'pc', packet: 'pkt' };

const ProductCatalogModal = ({ onClose, onAdded }) => {
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [prices, setPrices]           = useState({});       // index → price
  const [stocks, setStocks]           = useState({});       // index → stock
  const [selected, setSelected]       = useState(new Set());
  const [adding, setAdding]           = useState(false);
  const [done, setDone]               = useState(new Set()); // successfully added
  const [error, setError]             = useState('');

  // Filter products
  const filtered = useMemo(() => {
    return GROCERY_CATALOG.map((p, i) => ({ ...p, _idx: i })).filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const toggleSelect = (idx) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
    // Set default price if not set
    const product = GROCERY_CATALOG[idx];
    if (!prices[idx]) setPrices(p => ({ ...p, [idx]: String(product.suggested_price) }));
    if (!stocks[idx]) setStocks(s => ({ ...s, [idx]: '100' }));
  };

  const handleAddSelected = async () => {
    if (selected.size === 0) { setError('Select at least one product.'); return; }
    setAdding(true); setError('');

    const results = { success: 0, fail: 0 };
    for (const idx of selected) {
      const product = GROCERY_CATALOG[idx];
      const price   = Number(prices[idx] || product.suggested_price);
      const stock   = Number(stocks[idx] || 100);
      if (!price || price <= 0) { results.fail++; continue; }

      try {
        const fd = new FormData();
        fd.append('product_name',   product.name);
        fd.append('category',       product.category);
        fd.append('unit_type',      product.unit_type);
        fd.append('price',          price);
        fd.append('stock_quantity', stock);
        fd.append('is_available',   '1');
        await addProduct(fd);
        results.success++;
        setDone(prev => new Set([...prev, idx]));
      } catch { results.fail++; }
    }

    setAdding(false);
    setSelected(new Set());
    if (results.success > 0) {
      onAdded?.(results.success);
      if (results.fail === 0) onClose();
      else setError(`${results.success} added. ${results.fail} failed — may already exist.`);
    } else {
      setError('All selected products failed to add. They may already exist in your shop.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white w-full flex flex-col shadow-2xl" style={{ maxWidth: 900, height: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-green-600">
              <FiShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Product Catalog</h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                {GROCERY_CATALOG.length} common grocery items — select, set your price, add to shop
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center hover:bg-slate-100 transition text-slate-500">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Search + Category filter */}
        <div className="border-b border-[#E2E8F0] px-6 py-3 flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] text-sm outline-none focus:border-green-500"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-[#E2E8F0] text-sm outline-none focus:border-green-500 bg-white"
            style={{ minWidth: 180 }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FiShoppingBag className="h-12 w-12 text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-slate-500">No products match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(product => {
                const idx      = product._idx;
                const isSel    = selected.has(idx);
                const isDone   = done.has(idx);
                const price    = prices[idx] ?? String(product.suggested_price);
                const stock    = stocks[idx] ?? '100';

                return (
                  <div
                    key={idx}
                    onClick={() => !isDone && toggleSelect(idx)}
                    className="border cursor-pointer transition-all"
                    style={{
                      borderColor: isDone ? '#16A34A' : isSel ? '#16A34A' : '#E2E8F0',
                      background:  isDone ? '#F0FDF4' : isSel ? '#F0FDF4' : '#FFFFFF',
                      padding: 14,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{product.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {product.category} · {UNIT_LABELS[product.unit_type]}
                        </p>
                      </div>
                      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 transition ${
                        isDone  ? 'border-green-600 bg-green-600' :
                        isSel   ? 'border-green-600 bg-green-600' :
                        'border-slate-300 bg-white'
                      }`}>
                        {(isSel || isDone) && <FiCheck className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>

                    {/* Price + Stock inputs — only show when selected */}
                    {(isSel && !isDone) && (
                      <div
                        className="mt-3 grid grid-cols-2 gap-2"
                        onClick={e => e.stopPropagation()}
                      >
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Your Price (₹)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={price}
                            onChange={e => setPrices(p => ({ ...p, [idx]: e.target.value }))}
                            className="w-full border border-[#E2E8F0] px-2 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={e => setStocks(s => ({ ...s, [idx]: e.target.value }))}
                            className="w-full border border-[#E2E8F0] px-2 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-green-500"
                          />
                        </div>
                      </div>
                    )}

                    {isDone && (
                      <p className="mt-2 text-xs font-bold text-green-600">✓ Added to your shop</p>
                    )}

                    {/* Suggested price shown when not selected */}
                    {!isSel && !isDone && (
                      <p className="mt-2 text-xs text-slate-400">
                        Suggested: ₹{product.suggested_price} / {UNIT_LABELS[product.unit_type]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E8F0] px-6 py-4 flex-shrink-0 flex items-center justify-between gap-4">
          <div>
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
            {selected.size > 0 && (
              <p className="text-sm font-semibold text-slate-700">
                {selected.size} product{selected.size > 1 ? 's' : ''} selected
              </p>
            )}
            {done.size > 0 && (
              <p className="text-xs text-green-600 font-semibold mt-0.5">
                ✓ {done.size} product{done.size > 1 ? 's' : ''} added to your shop
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 border border-[#E2E8F0] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Close
            </button>
            <button
              onClick={handleAddSelected}
              disabled={adding || selected.size === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white text-sm font-bold transition"
            >
              {adding ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Adding…</>
              ) : (
                <><FiPlus className="h-4 w-4" /> Add {selected.size > 0 ? `${selected.size} ` : ''}to Shop</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogModal;
