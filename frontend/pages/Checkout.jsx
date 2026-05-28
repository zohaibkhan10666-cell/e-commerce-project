import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../src/components/ui/button.jsx';
import { Input } from '../src/components/ui/input.jsx';
import { Label } from '../src/components/ui/label.jsx';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Checkout = () => {
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const [address, setAddress] = useState({
    address: '',
    address2: '',
    city: '',
    phoneNo: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getShipping = () => totalPrice > 5000 ? 0 : 250;
  const shipping = getShipping();
  const total = totalPrice + shipping;

  const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const [paymentToken, setPaymentToken] = useState('');

  const handleJazzcashSubmit = async () => {
    if (!address.address || !address.city || !address.phoneNo || !paymentToken) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
console.log('Checkout token check:', token ? token.substring(0,20)+'...' : 'NO TOKEN');
      if (!token && !(paymentToken === 'test1123' || paymentToken === 'test123')) throw new Error('Please login first - no token found');

const response = await axios.post(
        'http://localhost:8000/api/v1/orders/jazzcash/initiate-jazzcash',
        {
          items,
          shippingAddress: address,
          paymentToken,
          // allow backend to enter test/demo mode without requiring user access token
          testDemo: paymentToken === 'test1123' || paymentToken === 'test123'
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            (response.data.pending ? 'Payment initiated. Waiting for confirmation...' : 'Payment successful!')
        );
        navigate(`/payment-success/${response.data.orderNumber}`);
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }


    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);



  return (
    <div className="pt-24 pb-12 min-h-screen bg-pink-50">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 mb-6 text-pink-600 hover:text-pink-700">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Address *</Label>
                <Input
                  name="address"
                  value={address.address}
                  onChange={handleAddressChange}
                  placeholder="House no, street, etc."
                  required
                />
              </div>
              <div>
                <Label>Address 2</Label>
                <Input
                  name="address2"
                  value={address.address2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, suite (optional)"
                />
              </div>
              <div>
                <Label>City *</Label>
                <Input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  name="phoneNo"
                  type="tel"
                  value={address.phoneNo}
                  onChange={handleAddressChange}
                  placeholder="03xxxxxxxxx"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-3">
                <span>Total</span>
                <span className="text-pink-600">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                JazzCash Payment
              </h3>
              <div>
                <Label className="text-sm font-medium">Payment Token * (JazzCash App)</Label>
                <Input
                  type="text"
                  placeholder="Enter token from JazzCash app"
                  value={paymentToken}
                  onChange={(e) => setPaymentToken(e.target.value)}
                  className="mt-1 mb-3"
                />
              </div>
              <div className="text-xs text-gray-600 p-2 bg-white rounded border">
                <strong>Sandbox Mode:</strong> Use any token "test123" for demo. Production: Real JazzCash token.
              </div>
            </div>

            <Button
              onClick={handleJazzcashSubmit}
              disabled={loading || totalItems === 0}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 rounded-lg text-lg font-semibold transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2 inline-block"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay Securely Rs. ${total.toLocaleString()}`
              )}
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Secure payment powered by JazzCash
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
