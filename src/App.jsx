import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer & Vendor Shopping Routes */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'VENDOR']} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders/mine" element={<MyOrdersPage />} />
          </Route>

          {/* Vendor Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;