import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ShopGuard from './components/ShopGuard';

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Retailer pages
import RetailerDashboard from './pages/RetailerDashboard';
import CreateShop        from './pages/retailer/CreateShop';
import ShopSettings      from './pages/retailer/ShopSettings';
import AddProduct        from './pages/retailer/AddProduct';
import ManageProducts    from './pages/retailer/ManageProducts';
import Orders            from './pages/retailer/Orders';
import Analytics         from './pages/retailer/Analytics';
import Inventory         from './pages/retailer/Inventory';
import RetailerProfile   from './pages/retailer/RetailerProfile';

// Customer pages
import CustomerDashboard  from './pages/CustomerDashboard';
import CustomerOrders     from './pages/customer/CustomerOrders';
import CustomerFavourites from './pages/customer/CustomerFavourites';
import CustomerAddresses  from './pages/customer/CustomerAddresses';
import CustomerProfile    from './pages/customer/CustomerProfile';
import CustomerSettings   from './pages/customer/CustomerSettings';
import Shops              from './pages/customer/Shops';
import ShopDetail         from './pages/customer/ShopDetail';

// Wrapper: requires login + retailer role
const Retailer = ({ children }) => (
  <ProtectedRoute allowedRoles={['retailer']}>{children}</ProtectedRoute>
);

// Wrapper: requires login + retailer + existing shop
const RetailerWithShop = ({ children }) => (
  <Retailer><ShopGuard>{children}</ShopGuard></Retailer>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public ─────────────────────────────────── */}
          <Route path="/"       element={<Navigate to="/login" replace />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Retailer: shop creation (no shop guard) ── */}
          <Route path="/retailer/create-shop"
            element={<Retailer><CreateShop /></Retailer>} />

          {/* ── Retailer: all pages need a shop ────────── */}
          <Route path="/retailer/dashboard"
            element={<RetailerWithShop><RetailerDashboard /></RetailerWithShop>} />
          <Route path="/retailer/orders"
            element={<RetailerWithShop><Orders /></RetailerWithShop>} />
          <Route path="/retailer/add-product"
            element={<RetailerWithShop><AddProduct /></RetailerWithShop>} />
          <Route path="/retailer/manage-products"
            element={<RetailerWithShop><ManageProducts /></RetailerWithShop>} />
          <Route path="/retailer/inventory"
            element={<RetailerWithShop><Inventory /></RetailerWithShop>} />
          <Route path="/retailer/analytics"
            element={<RetailerWithShop><Analytics /></RetailerWithShop>} />
          <Route path="/retailer/shop-settings"
            element={<RetailerWithShop><ShopSettings /></RetailerWithShop>} />
          <Route path="/retailer/profile"
            element={<Retailer><RetailerProfile /></Retailer>} />

          {/* ── Customer ────────────────────────────────── */}
          <Route path="/customer/dashboard"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/shops"
            element={<ProtectedRoute allowedRoles={['customer']}><Shops /></ProtectedRoute>} />
          <Route path="/customer/shop/:shopId"
            element={<ProtectedRoute allowedRoles={['customer']}><ShopDetail /></ProtectedRoute>} />
          <Route path="/customer/orders"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerOrders /></ProtectedRoute>} />
          <Route path="/customer/favourites"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerFavourites /></ProtectedRoute>} />
          <Route path="/customer/addresses"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerAddresses /></ProtectedRoute>} />
          <Route path="/customer/profile"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>} />
          <Route path="/customer/settings"
            element={<ProtectedRoute allowedRoles={['customer']}><CustomerSettings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
