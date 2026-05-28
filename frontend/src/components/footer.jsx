import React from 'react'
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-4 gap-8 mb-12'>
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/kart.png" alt="logo" className="w-32 h-auto drop-shadow-md" />
            </Link>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for all your needs. Quality products at great prices with excellent customer service.
            </p>
            <div className='flex gap-4'>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link to="/" className="text-gray-400 hover:text-pink-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pink-500 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-pink-500 transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Cart
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Return Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className='space-y-3'>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span>123 Shop Street, City, Country</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-pink-500" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-pink-500" />
                <span>support@shop.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 pt-8 text-center'>
          <p className="text-gray-400">
            © {new Date().getFullYear()} ShopKart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

