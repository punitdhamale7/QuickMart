import { FiEdit2, FiMapPin, FiClock, FiHash, FiPhone, FiStar } from 'react-icons/fi';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5 leading-snug">{value}</p>
    </div>
  </div>
);

const ShopInfoCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold text-gray-900">Shop Information</h2>
        <p className="text-xs text-gray-400 mt-0.5">Your store details</p>
      </div>
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 border border-green-100 px-3 py-1.5 rounded-lg transition-colors">
        <FiEdit2 className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>

    {/* Shop name + status */}
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-white font-black text-base">F</span>
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">Fresh Mart Store</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
          <span className="text-xs font-semibold text-green-600">Currently Open</span>
        </div>
      </div>
    </div>

    {/* Info rows */}
    <div className="space-y-3.5">
      <InfoRow icon={FiHash}   label="GST Number" value="27AABCU9603R1ZM" />
      <InfoRow icon={FiMapPin} label="Address"     value="Shop No. 12, Main Market, Sector 21, Pune – 411001" />
      <InfoRow icon={FiClock}  label="Timings"     value="8:00 AM – 10:00 PM" />
      <InfoRow icon={FiPhone}  label="Contact"     value="+91 98765 43210" />
    </div>

    {/* Stats grid */}
    <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
      <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <p className="text-lg font-black text-green-700">4.8</p>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Rating</p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
        <p className="text-lg font-black text-blue-700 mb-1">1,234</p>
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Total Orders</p>
      </div>
    </div>
  </div>
);

export default ShopInfoCard;
