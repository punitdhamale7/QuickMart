import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiShoppingBag, FiPackage, FiBox,
  FiBarChart2, FiSettings, FiLogOut, FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { icon: FiHome,        label: 'Dashboard', path: '/retailer/dashboard'       },
  { icon: FiShoppingBag, label: 'Orders',    path: '/retailer/orders'          },
  { icon: FiPackage,     label: 'Products',  path: '/retailer/manage-products' },
  { icon: FiBox,         label: 'Inventory', path: '/retailer/inventory'       },
  { icon: FiBarChart2,   label: 'Analytics', path: '/retailer/analytics'       },
  { icon: FiSettings,    label: 'Settings',  path: '/retailer/shop-settings'   },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '--';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile dim overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/*
        Sidebar:
          • w-[260px] — spec says 260 px
          • fixed top-0 left-0 h-full — always covers full viewport height
          • z-50 — above the content and navbar overlay
          • translate-x-full on mobile until isOpen = true
          • lg:translate-x-0 — always visible on desktop
      */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 flex h-full w-[260px] flex-col',
          'border-r border-[#E2E8F0] bg-white',
          'transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        {/* ── Logo — 70px height matches navbar ── */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-[#E2E8F0] px-6"
          style={{ height: '70px' }}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center make-circle bg-[#16A34A] shadow-sm">
            <span className="text-base font-extrabold leading-none text-white">Q</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight text-[#0F172A]">QuickMart</p>
            <p className="text-[11px] font-semibold leading-tight text-[#64748B]">Retailer Panel</p>
          </div>
          {/* Mobile-only close button */}
          <button
            onClick={onClose}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-slate-100 transition lg:hidden"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
            Main Menu
          </p>
          <ul className="space-y-1">
            {NAV.map(({ icon: Icon, label, path }) => {
              const active = pathname === path;
              return (
                <li key={path}>
                  <button
                    onClick={() => { navigate(path); onClose(); }}
                    className={[
                      'flex w-full items-center gap-3 px-3 text-sm font-medium transition-all',
                      active
                        ? 'bg-[#16A34A] text-white'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]',
                    ].join(' ')}
                    style={{ height: '48px', borderRadius: '12px' }}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── User footer ── */}
        <div className="shrink-0 border-t border-[#E2E8F0] p-4 space-y-1">
          {/* User info row */}
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center make-circle bg-[#16A34A] text-[12px] font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#0F172A]">{user?.full_name || 'Retailer'}</p>
              <p className="truncate text-[11px] text-[#64748B]">{user?.email}</p>
            </div>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 text-sm font-medium text-[#EF4444] transition hover:bg-red-50"
            style={{ height: '40px', borderRadius: '10px' }}
          >
            <FiLogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
