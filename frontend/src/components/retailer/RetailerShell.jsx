import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const SIDEBAR_W = 260;
const NAVBAR_H  = 70;

const RetailerShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content wrapper */}
      <div className="retailer-content" style={{ minHeight: '100vh' }}>
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main style={{ paddingTop: NAVBAR_H }}>
          {children}
        </main>
      </div>

      {/* Guaranteed layout CSS — not dependent on Tailwind purge */}
      <style>{`
        @media (min-width: 1024px) {
          .retailer-content   { padding-left: ${SIDEBAR_W}px; }
          .retailer-navbar    { left: ${SIDEBAR_W}px !important; }
        }
      `}</style>
    </div>
  );
};

export default RetailerShell;
