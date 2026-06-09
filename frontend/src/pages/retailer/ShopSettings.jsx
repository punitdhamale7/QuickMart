import { useState, useEffect } from 'react';
import { FiSave, FiShoppingBag, FiMapPin, FiPhone, FiClock, FiAlertCircle, FiCheck, FiImage } from 'react-icons/fi';
import { getMyShop, updateShop } from '../../services/shopService';
import RetailerShell from '../../components/retailer/RetailerShell';

const Input = ({ className = '', ...props }) => (
  props.type === 'file' ? (
    <input
      className={`w-full text-sm text-[#64748B] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition ${className}`}
      {...props}
    />
  ) : (
    <input
      className={`w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition disabled:bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] ${className}`}
      {...props}
    />
  )
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-[#334155]">{label}</label>
    {children}
  </div>
);

/* Shared content container — max-width 1400px, padding 24px 32px */
const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const ShopSettings = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getMyShop().then(r => {
      setShop(r.shop);
      if (r.shop.shop_image) {
        setPreview(`http://localhost:5000${r.shop.shop_image}`);
      }
      setForm({
        shop_name: r.shop.shop_name,
        shop_description: r.shop.shop_description || '',
        address: r.shop.address,
        city: r.shop.city,
        area: r.shop.area,
        pincode: r.shop.pincode,
        gst_number: r.shop.gst_number || '',
        contact_number: r.shop.contact_number,
        opening_time: r.shop.opening_time.slice(0, 5),
        closing_time: r.shop.closing_time.slice(0, 5),
        shop_status: r.shop.shop_status,
      });
    }).catch(() => setError('Failed to load shop settings.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      if (file) {
        formData.append('shop_image', file);
      }
      await updateShop(shop.id, formData);
      setSuccess('Shop settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update shop settings.');
    } finally { setSaving(false); }
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16A34A] mx-auto" />
        <p className="mt-3 text-sm text-[#64748B]">Loading settings…</p>
      </div>
    </div>
  );

  return (
    <RetailerShell>
      <Container>
        {/* Header — 100px height */}
        <div
          className="flex items-center justify-between border-b border-[#E2E8F0] mb-8"
          style={{ height: '100px' }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Shop Settings
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Update your shop profile and settings visible to customers
            </p>
          </div>
        </div>

        <div className="max-w-3xl">
          {error && (
            <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <FiAlertCircle className="w-4 h-4 mt-0.5" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <FiCheck className="w-4 h-4" /> {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiShoppingBag className="w-4 h-4" /> Basic Information
              </p>
              <div className="space-y-4">
                <Field label="Shop Name *">
                  <Input name="shop_name" value={form.shop_name || ''} onChange={set} required disabled={saving} />
                </Field>
                <Field label="Description">
                  <textarea
                    name="shop_description"
                    value={form.shop_description || ''}
                    onChange={set}
                    rows={3}
                    disabled={saving}
                    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition resize-none disabled:bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </Field>
                <Field label="Shop Cover Photo">
                  <div className="flex items-center gap-4">
                    {preview && (
                      <div className="w-16 h-16 rounded-xl border border-[#E2E8F0] overflow-hidden flex-shrink-0">
                        <img src={preview} alt="Shop Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={saving}
                    />
                  </div>
                </Field>
                <Field label="Shop Status">
                  <select
                    name="shop_status"
                    value={form.shop_status || 'open'}
                    onChange={set}
                    disabled={saving}
                    className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition text-[#0F172A]"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </Field>
              </div>
            </div>


            {/* Location */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiMapPin className="w-4 h-4" /> Location
              </p>
              <div className="space-y-4">
                <Field label="Address *">
                  <Input name="address" value={form.address || ''} onChange={set} required disabled={saving} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City *">
                    <Input name="city" value={form.city || ''} onChange={set} required disabled={saving} />
                  </Field>
                  <Field label="Area *">
                    <Input name="area" value={form.area || ''} onChange={set} required disabled={saving} />
                  </Field>
                </div>
                <Field label="Pincode *">
                  <Input name="pincode" value={form.pincode || ''} onChange={set} maxLength={6} required disabled={saving} />
                </Field>
              </div>
            </div>

            {/* Contact & Tax */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiPhone className="w-4 h-4" /> Contact & Tax
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact Number *">
                  <Input
                    name="contact_number"
                    value={form.contact_number || ''}
                    onChange={set}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    disabled={saving}
                  />
                </Field>
                <Field label="GST Number">
                  <Input name="gst_number" value={form.gst_number || ''} onChange={set} disabled={saving} />
                </Field>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <FiClock className="w-4 h-4" /> Timings
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Opening Time *">
                  <Input type="time" name="opening_time" value={form.opening_time || ''} onChange={set} required disabled={saving} />
                </Field>
                <Field label="Closing Time *">
                  <Input type="time" name="closing_time" value={form.closing_time || ''} onChange={set} required disabled={saving} />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#94A3B8] text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving Changes…
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </Container>
    </RetailerShell>
  );
};

export default ShopSettings;
