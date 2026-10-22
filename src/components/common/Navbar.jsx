import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Package, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <ShoppingBag className="h-6 w-6" />
          <span>ShopEase</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">
            Shop
          </Link>

          {user ? (
            <>
              {/* Customer & Vendor Shopping Links */}
              {(user.role === 'USER' || user.role === 'VENDOR') && (
                <>
                  <Link
                    to="/orders/mine"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm"
                  >
                    <Package className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>
                  </Link>
                </>
              )}

              {/* Vendor Portal Link */}
              {user.role === 'VENDOR' && (
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Vendor Portal</span>
                </Link>
              )}

              {/* Admin Portal Link */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Badge & Logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{user.email}</span>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 ml-1">
                    ({user.role})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;