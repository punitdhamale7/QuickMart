import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMyShop } from '../services/shopService';

// If retailer has no shop → redirect to /retailer/create-shop
const ShopGuard = ({ children }) => {
  const [status, setStatus] = useState('checking'); // checking | has-shop | no-shop

  useEffect(() => {
    getMyShop()
      .then(() => setStatus('has-shop'))
      .catch((err) => {
        // 404 means no shop exists yet
        if (err.message === 'No shop found.' || err.success === false) {
          setStatus('no-shop');
        } else {
          // Network/server error – let them through to dashboard which will handle it
          setStatus('has-shop');
        }
      });
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading your shop…</p>
        </div>
      </div>
    );
  }

  if (status === 'no-shop') {
    return <Navigate to="/retailer/create-shop" replace />;
  }

  return children;
};

export default ShopGuard;
