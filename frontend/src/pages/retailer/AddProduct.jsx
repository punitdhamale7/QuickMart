import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiUpload, FiCheck, FiAlertCircle, FiX, FiArrowLeft, FiGrid } from 'react-icons/fi';
import { addProduct } from '../../services/productService';
import RetailerShell from '../../components/retailer/RetailerShell';
import ProductCatalogModal from '../../components/retailer/ProductCatalogModal';

const CATEGORIES = [
  'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Grains & Pulses', 'Beverages',
  'Snacks', 'Spices & Condiments', 'Oils & Ghee', 'Personal Care', 'Cleaning', 'Frozen Foods', 'Other'
];

const UNITS = [
  { value: 'kg',     label: 'Kilogram (KG)' },
  { value: 'gram',   label: 'Gram (g)'      },
  { value: 'liter',  label: 'Liter (L)'     },
  { value: 'piece',  label: 'Piece / Unit'  },
  { value: 'packet', label: 'Packet'        },
];

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition disabled:bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] ${className}`}
    {...props}
  />
);

const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-[#334155]">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* Shared content container — max-width 1400px, padding 24px 32px */
const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [form, setForm] = useState({
    product_name: '', category: '', description: '',
    unit_type: 'kg', price: '', stock_quantity: '', is_available: '1',
  });
  const [imageFile, setImageFile] = useState(null);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('product_image', imageFile);
      await addProduct(fd);
      navigate('/retailer/manage-products');
    } catch (err) {
      setError(err.message || 'Failed to add product.');
    } finally { setLoading(false); }
  };

  return (
    <RetailerShell>
      <Container>
        {/* Header section — 100px height with back button */}
        <div
          className="flex items-center gap-4 border-b border-[#E2E8F0] mb-8"
          style={{ height: '100px' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#F1F5F9] rounded-xl transition text-[#64748B]"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Add Product
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Add a new product to your shop inventory
            </p>
          </div>
          {/* Browse Catalog Button */}
          <button
            type="button"
            onClick={() => setShowCatalog(true)}
            className="flex items-center gap-2 border-2 border-green-600 bg-green-50 hover:bg-green-100 text-green-700 font-bold px-5 py-2.5 text-sm transition"
          >
            <FiGrid className="w-4 h-4" />
            Browse Catalog
          </button>
        </div>

        {showCatalog && (
          <ProductCatalogModal
            onClose={() => setShowCatalog(false)}
            onAdded={(count) => {
              setShowCatalog(false);
              navigate('/retailer/manage-products');
            }}
          />
        )}

        <div className="max-w-2xl">
          {error && (
            <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <FiAlertCircle className="w-4 h-4 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiUpload className="w-3.5 h-3.5" /> Product Image
              </p>
              <div className="flex items-start gap-5">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#CBD5E1] flex items-center justify-center bg-[#F8FAFC] overflow-hidden flex-shrink-0">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiPackage className="w-8 h-8 text-[#CBD5E1]" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] font-semibold text-sm rounded-xl cursor-pointer transition border border-[#BBF7D0]">
                    <FiUpload className="w-4 h-4" /> Choose Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
                  </label>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setImageFile(null); }}
                      className="ml-4 text-xs text-[#94A3B8] hover:text-[#EF4444] transition"
                    >
                      <FiX className="w-4 h-4 inline mr-1" /> Remove
                    </button>
                  )}
                  <p className="text-xs text-[#94A3B8] mt-2">JPEG, PNG or WebP · max 5 MB</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiPackage className="w-3.5 h-3.5" /> Product Details
              </p>
              <div className="space-y-4">
                <Field label="Product Name" required>
                  <Input name="product_name" value={form.product_name} onChange={set} placeholder="e.g. Basmati Rice" required disabled={loading} />
                </Field>
                <Field label="Category" required>
                  <select
                    name="category"
                    value={form.category}
                    onChange={set}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition text-[#0F172A]"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={set}
                    rows={3}
                    disabled={loading}
                    placeholder="Describe the product…"
                    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition resize-none disabled:bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </Field>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiDollarSign className="w-3.5 h-3.5" /> Pricing & Stock
              </p>
              <div className="space-y-4">
                <Field label="Unit Type" required>
                  <select
                    name="unit_type"
                    value={form.unit_type}
                    onChange={set}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition text-[#0F172A]"
                  >
                    {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Price (₹)" required>
                    <Input type="number" name="price" value={form.price} onChange={set} placeholder="0.00" min="0" step="0.01" required disabled={loading} />
                  </Field>
                  <Field label="Stock Quantity" required>
                    <Input type="number" name="stock_quantity" value={form.stock_quantity} onChange={set} placeholder="0" min="0" step="0.01" required disabled={loading} />
                  </Field>
                </div>
                <Field label="Availability">
                  <div className="flex items-center gap-6 pt-1">
                    {['1', '0'].map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="is_available"
                          value={v}
                          checked={form.is_available === v}
                          onChange={set}
                          className="w-4 h-4 text-[#16A34A] border-[#CBD5E1] focus:ring-[#16A34A]"
                        />
                        <span className="text-sm text-[#334155]">{v === '1' ? '✅ Available' : '❌ Unavailable'}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#94A3B8] text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding Product…
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" /> Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </Container>
    </RetailerShell>
  );
};

export default AddProduct;
