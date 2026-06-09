import { useState, useEffect } from 'react';
import {
  FiSearch, FiBell, FiChevronDown, FiMenu,
  FiLogOut, FiUser, FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyShop, toggleShopStatus } from '../../services/shopService';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Shop status state
  const [shop, setShop]           = useState(null);   // { id, shop_status }
  const [toggling, setToggling]   = useState(false);

  // Load shop status once on mount
  useEffect(() => {
    getMyShop()
      .then(r => setShop(r.shop))
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleToggle = async () => {
    if (!shop || toggling) return;
    setToggling(true);
    try {
      const res = await toggleShopStatus(shop.id, shop.shop_status);
      setShop(res.shop);  // update local state with new status
    } catch (e) {
      console.error('Toggle failed', e);
    } finally {
      setToggling(false);
    }
  };

  const isOpen  = shop?.shop_status === 'open';
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '--';

  return (
    <header
      className="retailer-navbar fixed top-0 right-0 left-0 z-40 flex items-center border-b border-[#E2E8F0] bg-white px-4 sm:px-6"
      style={{ height: '70px' }}
    >
      {/* ── Left: Hamburger + Search ── */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] transition lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="relative hidden lg:block" style={{ width: '360px' }}>
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search orders, products…"
            className="h-10 w-full border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#64748B] outline-none transition focus:border-[#16A34A]"
          />
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex shrink-0 items-center gap-3">

        {/* ── SHOP TOGGLE BUTTON ── */}
        {shop && (
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={isOpen ? 'Click to close shop' : 'Click to open shop'}
            className="flex items-center gap-2 border px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition disabled:opacity-60"
            style={{
              borderColor: isOpen ? '#16A34A' : '#DC2626',
              backgroundColor: isOpen ? '#F0FDF4' : '#FFF5F5',
              color: isOpen ? '#15803D' : '#DC2626',
              cursor: toggling ? 'wait' : 'pointer',
            }}
          >
            {/* Toggle pill */}
            <div
              className="relative flex items-center"
              style={{ width: 36, height: 20 }}
            >
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  backgroundColor: isOpen ? '#16A34A' : '#9CA3AF',
                }}
              />
              <div
                className="absolute h-4 w-4 bg-white shadow transition-transform"
                style={{
                  top: 2,
                  left: isOpen ? 18 : 2,
                }}
              />
            </div>
            {toggling ? 'Saving…' : isOpen ? 'Open' : 'Closed'}
          </button>
        )}

        {/* Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 transition">
          <FiBell className="h-[15px] w-[15px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 make-circle bg-[#16A34A]" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2 border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 transition hover:bg-slate-100"
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
              <div className="absolute right-0 top-full z-20 mt-2 w-56 border border-[#E2E8F0] bg-white py-1.5 shadow-lg">
                <div className="border-b border-[#E2E8F0] px-4 py-3">
                  <p className="truncate text-[13px] font-semibold text-[#0F172A]">{user?.full_name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[#64748B]">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/retailer/shop-settings'); setShowProfile(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#64748B] hover:bg-[#F8FAFC] transition"
                >
                  <FiSettings className="h-4 w-4 shrink-0" /> Shop Settings
                </button>
                <button
                  onClick={() => { navigate('/retailer/profile'); setShowProfile(false); }}
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
  );
};

export default Navbar;
