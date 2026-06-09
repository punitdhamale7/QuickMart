import CustomerShell from '../../components/customer/CustomerShell';
import { FiSettings } from 'react-icons/fi';

const CustomerSettings = () => (
  <CustomerShell>
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-sm text-slate-500 mb-8">Manage your account preferences</p>
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <FiSettings className="w-14 h-14 text-slate-200 mb-4" />
        <h3 className="text-base font-bold text-slate-700 mb-1">Settings coming soon</h3>
        <p className="text-sm text-slate-400">Notification, privacy and account settings will be available here.</p>
      </div>
    </div>
  </CustomerShell>
);

export default CustomerSettings;
