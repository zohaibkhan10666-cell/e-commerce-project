import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "./button.jsx";
import { ShoppingCart, LayoutDashboard, X, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/userSlice";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./sheet.jsx"; // Assume shadcn Sheet exists
import axios from "axios";
import { toast } from "sonner";

const MobileMenu = () => {
  const dispatch = useDispatch();
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
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2">
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <SheetClose>
            <X className="w-5 h-5" />
          </SheetClose>
        </div>
        <div className="p-4 space-y-4">
          <nav className="space-y-4">
            <Link to="/" className="block py-2 text-lg font-medium hover:text-pink-600">Home</Link>
            <Link to="/products" className="block py-2 text-lg font-medium hover:text-pink-600">Products</Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="block py-2 text-lg font-medium hover:text-pink-600 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Admin
              </Link>
            )}
            <Link to="/profile" className="block py-2 text-lg font-medium hover:text-pink-600">
              Profile
            </Link>
          </nav>
          <div className="pt-4 border-t">
            <Link to="/cart" className="flex items-center gap-3 text-lg font-medium hover:text-pink-600 mb-4">
              <ShoppingCart className="w-6 h-6" />
              Cart ({totalItems})
            </Link>
            {isAuthenticated ? (
<Button onClick={(e) => {
              e.stopPropagation();
              logoutHandler();
            }} className="w-full bg-pink-600">Logout</Button>
            ) : (
              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

