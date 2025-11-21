import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { ShoppingBag, User, LogOut, ChefHat, BarChart3, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isStaff = userInfo && ['KitchenManager', 'CounterStaff', 'SuperAdmin'].includes(userInfo.role);
  const isAdmin = userInfo && userInfo.role === 'SuperAdmin';

  const isActive = (path) => location.pathname === path ? 'text-primary font-bold' : 'text-gray-500 hover:text-black';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand */}
          <div className="flex items-center gap-12">
            <Link to="/" className="text-3xl font-serif font-black text-secondary tracking-tight flex items-center gap-1">
              Crave<span className="text-primary text-4xl leading-none">.</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-semibold">
              <Link to="/" className={`transition-colors ${isActive('/')}`}>Menu</Link>
              
              {userInfo && !isStaff && (
                <Link to="/orders" className={`transition-colors ${isActive('/orders')}`}>Orders</Link>
              )}

              {isStaff && (
                <Link to="/dashboard" className="text-primary flex items-center gap-2">
                  <ChefHat size={18} /> Kitchen
                </Link>
              )}

              {isAdmin && (
                <Link to="/superadmin" className="text-purple-600 flex items-center gap-2">
                  <BarChart3 size={18} /> Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Coin Balance */}
            {userInfo && !isStaff && (
                <div className="hidden md:flex bg-orange-50 text-primary px-4 py-2 rounded-full text-xs font-bold items-center gap-2 border border-orange-100">
                    <Sparkles size={14} />
                    <span>{userInfo.coins || 0} PTS</span>
                </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary transition-colors duration-300">
                <ShoppingBag size={20} className="text-gray-700 group-hover:text-white" />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            {userInfo ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block">
                  <span className="block text-sm font-bold text-secondary leading-tight">{userInfo.name}</span>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider">{userInfo.role}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;