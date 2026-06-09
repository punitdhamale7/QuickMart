import CustomerShell from '../../components/customer/CustomerShell';
import { useAuth } from '../../context/AuthContext';
import { FiUser } from 'react-icons/fi';

const CustomerProfile = () => {
  const { user } = useAuth();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <CustomerShell>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-sm text-slate-500 mb-8">Manage your personal information</p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-5 pb-7 border-b border-slate-100 mb-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white shadow-sm">
              {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'CU'}
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{user?.full_name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Full Name',  value: user?.full_name },
              { label: 'Email',      value: user?.email     },
              { label: 'Phone',      value: user?.phone || '—' },
              { label: 'Role',       value: user?.role, cap: true },
              { label: 'Member Since', value: memberSince },
              { label: 'Status',     value: 'Active' },
            ].map(({ label, value, cap }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className={`text-sm font-semibold text-slate-800 ${cap ? 'capitalize' : ''}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerShell>
  );
};

export default CustomerProfile;
