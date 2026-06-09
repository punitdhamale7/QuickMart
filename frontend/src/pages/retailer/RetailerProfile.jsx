import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RetailerShell from '../../components/retailer/RetailerShell';
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield } from 'react-icons/fi';

const Container = ({ children }) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
    {children}
  </div>
);

const RetailerProfile = () => {
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'RT';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Recently joined';

  const fields = [
    { icon: FiUser,     label: 'Full Name',    value: user?.full_name },
    { icon: FiMail,     label: 'Email Address', value: user?.email    },
    { icon: FiPhone,    label: 'Phone Number',  value: user?.phone || '—' },
    { icon: FiShield,   label: 'Role',          value: user?.role,    cap: true },
    { icon: FiCalendar, label: 'Member Since',  value: memberSince   },
  ];

  return (
    <RetailerShell>
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] mb-8"
          style={{ height: '100px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>My Profile</h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Your personal account information
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          {/* Avatar + name card */}
          <div className="bg-white border border-[#E2E8F0] shadow-sm p-8 mb-6 flex items-center gap-6">
            <div
              className="flex items-center justify-center bg-[#16A34A] text-white font-extrabold text-2xl flex-shrink-0"
              style={{ width: 80, height: 80 }}
            >
              {initials}
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A' }}>{user?.full_name}</p>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>{user?.email}</p>
              <span
                className="inline-flex items-center gap-1.5 mt-3 border border-green-200 bg-green-50 px-3 py-1"
                style={{ fontSize: '12px', fontWeight: 600, color: '#15803D' }}
              >
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Active Retailer
              </span>
            </div>
          </div>

          {/* Info fields */}
          <div className="bg-white border border-[#E2E8F0] shadow-sm">
            {fields.map(({ icon: Icon, label, value, cap }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 px-6 py-4 ${i < fields.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}
              >
                <div className="flex h-9 w-9 items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#64748B]" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>{label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}
                    className={cap ? 'capitalize' : ''}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#94A3B8] text-center">
            To update your profile information, please contact support.
          </p>
        </div>
      </Container>
    </RetailerShell>
  );
};

export default RetailerProfile;
