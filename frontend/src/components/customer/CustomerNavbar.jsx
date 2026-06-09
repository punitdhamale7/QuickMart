import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiSearch, FiBell,
  FiChevronDown, FiLogOut, FiUser,
} from 'react-icons/fi';

const SIDEBAR_W = 260;

const CustomerNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CU';

  return (
    <>
      <header
        className="customer-navbar fixed top-0 right-0 left-0 z-40 flex items-center border-b border-[#E2E8F0] bg-white px-6"
        style={{ height: 70 }}
      >
        {/* Left */}
        <div className="flex flex-1 items-center gap-4">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition lg:hidden"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <div className="relative hidden lg:block" style={{ width: 360 }}>
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search shops, products…"
              className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#64748B] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 transition">
            <FiBell className="h-[15px] w-[15px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 transition hover:bg-slate-100"
            >
              <div className="flex h-7 w-7 items-center justify-center make-circle bg-[#16A34A] text-[11px] font-bold text-white">
                {initials}
              </div>
              <span className="hidden text-[13px] font-semibold text-[#0F172A] sm:block">
                {user?.full_name?.split(' ')[0]}
              </span>
              <FiChevronDown className={`h-3.5 w-3.5 text-[#64748B] transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-[#E2E8F0] bg-white py-1.5 shadow-lg">
                  <div className="border-b border-[#E2E8F0] px-4 py-3">
                    <p className="truncate text-[13px] font-semibold text-[#0F172A]">{user?.full_name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#64748B]">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/customer/profile'); setShowProfile(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition"
                  >
                    <FiUser className="h-4 w-4 shrink-0" /> My Profile
                  </button>
                  <div className="mt-1 border-t border-[#E2E8F0] pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 transition"
                    >
                      <FiLogOut className="h-4 w-4 shrink-0" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Guaranteed CSS — navbar shifts right of sidebar on desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .customer-navbar { left: ${SIDEBAR_W}px !important; }
        }
      `}</style>
    </>
  );
};

export default CustomerNavbar;
