import { useState } from 'react';
import CustomerSidebar from './CustomerSidebar';
import CustomerNavbar  from './CustomerNavbar';

const SIDEBAR_W = 260;
const NAVBAR_H  = 70;

const CustomerShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <CustomerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="customer-content" style={{ minHeight: '100vh' }}>
        <CustomerNavbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main style={{ paddingTop: NAVBAR_H }}>
          {children}
        </main>
      </div>

      {/* Guaranteed layout — not dependent on Tailwind purge */}
      <style>{`
        @media (min-width: 1024px) {
          .customer-content { padding-left: ${SIDEBAR_W}px; }
        }
      `}</style>
    </div>
  );
};

export default CustomerShell;
