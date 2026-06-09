import CustomerShell from '../../components/customer/CustomerShell';
import { FiHeart } from 'react-icons/fi';

const CustomerFavourites = () => (
  <CustomerShell>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Favourites</h1>
      <p className="text-sm text-slate-500 mb-8">Your saved shops and favourite products</p>
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <FiHeart className="w-14 h-14 text-slate-200 mb-4" />
        <h3 className="text-base font-bold text-slate-700 mb-1">No favourites yet</h3>
        <p className="text-sm text-slate-400">Save shops and products you love for quick access.</p>
      </div>
    </div>
  </CustomerShell>
);

export default CustomerFavourites;
