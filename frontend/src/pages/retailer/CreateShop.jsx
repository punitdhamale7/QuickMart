import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMapPin, FiPhone, FiClock, FiFileText, FiCheck, FiAlertCircle, FiImage } from 'react-icons/fi';
import { createShop } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  className.includes('type="file"') ? (
    <input
      className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition ${className}`}
      {...props}
    />
  ) : (
    <input
      className={`w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-50 ${className}`}
      {...props}
    />
  )
);

const CreateShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    shop_name: '', shop_description: '', address: '', city: '', area: '',
    pincode: '', gst_number: '', contact_number: '', opening_time: '08:00', closing_time: '22:00',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      if (file) {
        formData.append('shop_image', file);
      }
      await createShop(formData);
      navigate('/retailer/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create shop.');
    } finally { setLoading(false); }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Header card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl px-8 py-8 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-wide">Welcome, {user?.full_name}</p>
              <h1 className="text-2xl font-bold">Set Up Your Shop</h1>
            </div>
          </div>
          <p className="text-green-100 text-sm">
            Complete your shop profile to start selling on QuickMart. Customers nearby will be able to find and order from you.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Basic Info */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiShoppingBag className="w-3.5 h-3.5" /> Basic Information
              </p>
              <div className="space-y-4">
                <Field label="Shop Name *">
                  <Input name="shop_name" value={form.shop_name} onChange={set} placeholder="e.g. Fresh Mart Store" required disabled={loading} />
                </Field>
                <Field label="Shop Description">
                  <textarea
                    name="shop_description" value={form.shop_description} onChange={set}
                    placeholder="Briefly describe your shop and what you sell…"
                    rows={3} disabled={loading}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none disabled:bg-gray-50"
                  />
                </Field>
                <Field label="Shop Cover Photo">
                  <div className="flex items-center gap-4">
                    {preview && (
                      <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      className='type="file"'
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiMapPin className="w-3.5 h-3.5" /> Location
              </p>
              <div className="space-y-4">
                <Field label="Address *">
                  <Input name="address" value={form.address} onChange={set} placeholder="Shop No., Street, Building" required disabled={loading} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City *">
                    <Input name="city" value={form.city} onChange={set} placeholder="Pune" required disabled={loading} />
                  </Field>
                  <Field label="Area *">
                    <Input name="area" value={form.area} onChange={set} placeholder="Kothrud" required disabled={loading} />
                  </Field>
                </div>
                <Field label="Pincode *">
                  <Input name="pincode" value={form.pincode} onChange={set} placeholder="411038" maxLength={6} required disabled={loading} />
                </Field>
              </div>
            </div>

            {/* Contact & GST */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5" /> Contact & Tax
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact Number *">
                  <Input name="contact_number" value={form.contact_number} onChange={set}
                    placeholder="9876543210" pattern="[0-9]{10}" maxLength={10} required disabled={loading} />
                </Field>
                <Field label="GST Number">
                  <Input name="gst_number" value={form.gst_number} onChange={set}
                    placeholder="22AAAAA0000A1Z5" disabled={loading} />
                </Field>
              </div>
            </div>

            {/* Timings */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5" /> Shop Timings
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Opening Time *">
                  <Input type="time" name="opening_time" value={form.opening_time} onChange={set} required disabled={loading} />
                </Field>
                <Field label="Closing Time *">
                  <Input type="time" name="closing_time" value={form.closing_time} onChange={set} required disabled={loading} />
                </Field>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating shop…</>
              ) : (
                <><FiCheck className="w-4 h-4" /> Create My Shop</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShop;
