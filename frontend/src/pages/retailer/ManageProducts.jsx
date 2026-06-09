import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiAlertTriangle,
  FiPackage, FiFilter, FiRefreshCw, FiToggleLeft, FiToggleRight, FiGrid
} from 'react-icons/fi';
import { getMyProducts, deleteProduct, updateProduct } from '../../services/productService';
import RetailerShell from '../../components/retailer/RetailerShell';
import EditProductModal from '../../components/retailer/EditProductModal';
import ProductCatalogModal from '../../components/retailer/ProductCatalogModal';

const BADGE = {
  kg: 'bg-blue-50 text-blue-700 border-blue-200',
  gram: 'bg-purple-50 text-purple-700 border-purple-200',
  liter: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  piece: 'bg-orange-50 text-orange-700 border-orange-200',
  packet: 'bg-pink-50 text-pink-700 border-pink-200',
};

/* Shared content container — max-width 1400px, padding 24px 32px */
const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyProducts({ search, category, page, limit: 12 });
      setProducts(res.products);
      setPagination(res.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteConfirm);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const toggleAvailability = async (product) => {
    try {
      const fd = new FormData();
      fd.append('is_available', product.is_available ? '0' : '1');
      await updateProduct(product.id, fd);
      fetchProducts();
    } catch (e) { console.error(e); }
  };

  const imgSrc = (path) => path ? `http://localhost:5000${path}` : null;

  return (
    <RetailerShell>
      <Container>
        {/* Header section — 100px height */}
        <div
          className="flex items-center justify-between border-b border-[#E2E8F0] mb-8"
          style={{ height: '100px' }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Manage Products
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              {pagination.total || 0} products in your shop inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Browse Catalog Button */}
            <button
              onClick={() => setShowCatalog(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-green-600 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm transition"
            >
              <FiGrid className="w-4 h-4" /> Browse Catalog
            </button>
            <button
              onClick={() => navigate('/retailer/add-product')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm transition"
            >
              <FiPlus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Catalog Modal */}
        {showCatalog && (
          <ProductCatalogModal
            onClose={() => setShowCatalog(false)}
            onAdded={() => { setShowCatalog(false); fetchProducts(); }}
          />
        )}

        {/* Filters and search row */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm px-6 py-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products by name…"
              className="w-full pl-11 pr-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#16A34A] outline-none transition text-[#0F172A] placeholder-[#94A3B8]"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FiFilter className="text-[#94A3B8] w-4 h-4 flex-shrink-0" />
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#16A34A] outline-none transition text-[#0F172A]"
            >
              <option value="">All Categories</option>
              {['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Grains & Pulses', 'Beverages',
                'Snacks', 'Spices & Condiments', 'Oils & Ghee', 'Personal Care', 'Cleaning', 'Frozen Foods', 'Other']
                .map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={fetchProducts}
              className="p-3 hover:bg-[#F1F5F9] rounded-xl transition text-[#64748B] border border-[#E2E8F0]"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 animate-pulse">
                <div className="w-full h-40 bg-[#E2E8F0] rounded-xl mb-4" />
                <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#F1F5F9] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-16 text-center">
            <FiPackage className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#334155] mb-2">No products found</h3>
            <p className="text-sm text-[#64748B] mb-6">Add your first product to start setting up your store</p>
            <button
              onClick={() => navigate('/retailer/add-product')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm rounded-xl transition shadow-sm"
            >
              <FiPlus className="w-4 h-4" /> Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                <div>
                  {/* Image wrapper */}
                  <div className="relative w-full h-44 bg-[#F8FAFC] overflow-hidden">
                    {imgSrc(p.product_image) ? (
                      <img
                        src={imgSrc(p.product_image)}
                        alt={p.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-10 h-10 text-[#CBD5E1]" />
                      </div>
                    )}
                    {/* Live/Off Badge */}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full text-white shadow-sm ${p.is_available ? 'bg-[#22C55E]' : 'bg-[#64748B]'}`}>
                      {p.is_available ? 'Live' : 'Off'}
                    </span>
                    {p.stock_quantity < 10 && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#EF4444] text-white rounded-full shadow-sm">
                        <FiAlertTriangle className="w-3.5 h-3.5" /> Low Stock
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="font-semibold text-[#0F172A] text-sm truncate mb-1">{p.product_name}</p>
                    <p className="text-xs text-[#64748B] mb-4">{p.category}</p>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold text-[#16A34A]">₹{Number(p.price).toFixed(2)}</p>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${BADGE[p.unit_type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {p.unit_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#64748B] mb-4">
                      <span>Stock: <strong className={p.stock_quantity < 10 ? 'text-[#EF4444]' : 'text-[#334155]'}>{p.stock_quantity}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setEditProduct(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl transition border border-[#BFDBFE]"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => toggleAvailability(p)}
                    className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition border border-[#E2E8F0]"
                  >
                    {p.is_available ? (
                      <FiToggleRight className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <FiToggleLeft className="w-5 h-5 text-[#94A3B8]" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="p-2 text-[#EF4444] hover:bg-red-50 rounded-xl transition border border-red-100"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition border ${n === page ? 'bg-[#16A34A] text-white border-[#16A34A]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => { setEditProduct(null); fetchProducts(); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#E2E8F0]">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-6 h-6 text-[#EF4444]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-[#64748B] text-center mb-6">This action cannot be undone. The product and its image will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#E2E8F0] text-[#334155] font-semibold text-sm rounded-xl hover:bg-[#F8FAFC] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold text-sm rounded-xl transition disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </RetailerShell>
  );
};

export default ManageProducts;
