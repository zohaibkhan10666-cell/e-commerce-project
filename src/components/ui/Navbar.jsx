import { Link } from "react-router-dom";
import { Button } from "./button.jsx";
import { ShoppingCart, LayoutDashboard, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);
  const accessToken = localStorage.getItem('accessToken');

  const logoutHandler = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        toast.success(res.data.message || "Logout successful!");
        localStorage.removeItem('accessToken');
        dispatch(logout());
      }
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      localStorage.removeItem('accessToken');
    }
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen(prev => !prev);
  };
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header className="w-full h-16 fixed top-0 left-0 right-0 bg-gradient-to-r from-pink-50/80 to-rose-50/80 backdrop-blur-xl z-50 border-b border-pink-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <img src="/kart.png" alt="logo" className="w-32 h-auto bg-transparent drop-shadow-xl hover:scale-105 transition-transform" />
          </Link>

          <Button variant="ghost" className="md:hidden p-2 ml-auto hover:bg-pink-100/50 border border-pink-200/50" onClick={toggleMobile}>
            <Menu className="w-6 h-6 text-pink-600 hover:text-pink-700 transition-all" />
          </Button>

          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <ul className="flex items-center gap-8 text-base font-semibold text-gray-700">
              <Link to="/" className="hover:text-pink-600 transition-all hover:scale-105">
                <li>Home</li>
              </Link>
              <Link to="/products" className="hover:text-pink-600 transition-all hover:scale-105">
                <li>Products</li>
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="hover:text-pink-600 transition-all hover:scale-105">
                  <li className="flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </li>
                </Link>
              )}
              {isAuthenticated && user ? (
                <Link to="/profile" className="hover:text-pink-600 transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2 p-3 rounded-2xl hover:bg-pink-100/50 border border-pink-200/50">
                  <span>Hello,</span>
                  <span className="font-bold">{user?.firstName || user?.name || 'User'}</span>
                </Link>
              ) : (
                <Link to="/login" className="hover:text-pink-600 transition-all hover:scale-105 cursor-pointer">
                  <li>Hello User</li>
                </Link>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 transition-all hover:shadow-pink-200">
              <ShoppingCart className="w-6 h-6 text-pink-600 hover:text-pink-700 transition-all" />
              {totalItems > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Button onClick={(e) => {
                e.stopPropagation();
                logoutHandler();
              }} size="sm" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all">
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMobile} />
      <div className={`md:hidden fixed top-16 left-0 right-0 bg-gradient-to-b from-pink-50 to-white/90 backdrop-blur-xl border-t border-pink-200/50 z-50 transform transition-all duration-300 ${mobileOpen ? 'translate-y-0 opacity-100 shadow-2xl' : '-translate-y-full opacity-0'}`}>
        <nav className="flex flex-col p-6 space-y-4 text-lg font-semibold">
          <Link to="/" className="p-4 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 transition-all" onClick={toggleMobile} role="button">
            Home
          </Link>
<Link to="/products" className="p-4 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 transition-all" onClick={toggleMobile}>
            Products
          </Link>
          {isAdmin && (
            <Link to="/admin/dashboard" className="p-4 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 flex items-center gap-3 transition-all" onClick={toggleMobile}>
              <LayoutDashboard className="w-5 h-5 text-pink-600" />
              Admin
            </Link>
          )}
          <Link to="/profile" className="p-4 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 transition-all" onClick={toggleMobile}>
            Profile
          </Link>
<Link to="/cart" className="p-4 hover:bg-pink-100/50 rounded-2xl border border-pink-200/50 flex items-center gap-3 transition-all" onClick={toggleMobile}>
            <ShoppingCart className="w-5 h-5 text-pink-600" />
            Cart ({totalItems})
          </Link>
          {isAuthenticated ? (
            <Button onClick={(e) => {
              e.stopPropagation();
              logoutHandler();
            }} className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all">
              Logout
            </Button>
          ) : (
            <Link to="/login" onClick={toggleMobile}>
              <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
