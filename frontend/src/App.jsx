import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import Verify from "../pages/verify.jsx";
import Cart from "../pages/Cart.jsx";
import Profile from "../pages/Profile.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import AdminProducts from "../pages/AdminProducts.jsx";
import AdminOrders from "../pages/AdminOrders.jsx";
import Checkout from "../pages/Checkout.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import { Card } from "./components/ui/card.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /> <Home /></>,
  },
  {
    path: "/home",
    element: <><Navbar /><Home /></>,
  },
  {
    path: "/products",
    element: <><Navbar /><Products /></>,
  },
  {
    path: "/products/:id",
    element: <><Navbar /><ProductDetail /></>,
  },

  {
    path: "/signup",
    element: <><Navbar /><Signup /></>,
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>,
  },
  {
    path: "/verify",
    element: <><Navbar /><Verify /></>,
  },
  {
    path: "/cart",
    element: <><Navbar /><Cart /></>,
  },
  {
    path: "/profile",
    element: <><Navbar /><Profile /></>,
  },
  // Admin Routes
  {
    path: "/admin",
    element: <><Navbar /><AdminDashboard /></>,
  },
  {
    path: "/admin/dashboard",
    element: <><Navbar /><AdminDashboard /></>,
  },
  {
    path: "/admin/users",
    element: <><Navbar /><AdminUsers /></>,
  },
  {
    path: "/admin/products",
    element: <><Navbar /><AdminProducts /></>,
  },
  {
    path: "/admin/orders",
    element: <><Navbar /><AdminOrders /></>,
  },
  {
    path: "/checkout",
    element: <><Navbar /><Checkout /></>,
  },
  {
    path: "/payment-success/:orderNumber",
    element: <><Navbar /><PaymentSuccess /></>,
  }
]);


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;

