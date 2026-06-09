import { useState } from 'react';
import { FiX, FiUpload, FiSave } from 'react-icons/fi';
import { updateProduct } from '../../services/productService';

const CATEGORIES = [
  'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Grains & Pulses', 'Beverages',
  'Snacks', 'Spices & Condiments', 'Oils & Ghee', 'Personal Care', 'Cleaning', 'Frozen Foods', 'Other'
];
const UNITS = [
  { value: 'kg',     label: 'KG'     },
  { value: 'gram',   label: 'Gram'   },
  { value: 'liter',  label: 'Liter'  },
  { value: 'piece',  label: 'Piece'  },
  { value: 'packet', label: 'Packet' },
];

const Input = (props) => (
  <input
    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition text-[#0F172A] placeholder-[#94A3B8]"
    {...props}
  />
);

const EditProductModal = ({ product, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(product.product_image ? `http://localhost:5000${product.product_image}` : null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    product_name: product.product_name,
    category:     product.category,
    description:  product.description || '',
    unit_type:    product.unit_type,
    price:        product.price,
    stock_quantity: product.stock_quantity,
    is_available: product.is_available ? '1' : '0',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('product_image', imageFile);
      await updateProduct(product.id, fd);
      onSaved();
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E2E8F0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-bold text-[#0F172A]">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-xl transition text-[#64748B]">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Image */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC] flex-shrink-0 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] font-semibold text-sm rounded-xl cursor-pointer transition border border-[#BBF7D0] mt-2">
              <FiUpload className="w-4 h-4" /> Change Image
              <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">Product Name</label>
            <Input name="product_name" value={form.product_name} onChange={set} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={set}
                className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition text-[#0F172A]"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Unit Type</label>
              <select
                name="unit_type"
                value={form.unit_type}
                onChange={set}
                className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition text-[#0F172A]"
              >
                {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={set}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition resize-none text-[#0F172A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Price (₹)</label>
              <Input type="number" name="price" value={form.price} onChange={set} min="0" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Stock</label>
              <Input type="number" name="stock_quantity" value={form.stock_quantity} onChange={set} min="0" step="0.01" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">Availability</label>
            <div className="flex gap-6 pt-1">
              {[['1', '✅ Available'], ['0', '❌ Unavailable']].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_available"
                    value={v}
                    checked={form.is_available === v}
                    onChange={set}
                    className="w-4 h-4 text-[#16A34A] border-[#CBD5E1] focus:ring-[#16A34A]"
                  />
                  <span className="text-sm text-[#334155]">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E2E8F0] text-[#334155] font-semibold text-sm rounded-xl hover:bg-[#F8FAFC] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Saving…' : <><FiSave className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
