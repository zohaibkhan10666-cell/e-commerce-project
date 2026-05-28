import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import { Button } from '../src/components/ui/button.jsx';
import axios from 'axios';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/orders/${orderNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data.order);
      if (response.data.order.paymentStatus === 'paid') {
        setStatus('success');
      } else if (response.data.order.paymentStatus === 'pending') {
        setStatus('pending');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  useEffect(() => {
    if (status === 'pending') {
      const interval = setInterval(fetchOrder, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [status, orderNumber]);

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Checking payment status...</p>
          <p className="text-gray-500">Order #{orderNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {status === 'success' && (
            <>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
              <p className="text-xl text-green-600 mb-8">Thank you for your purchase.</p>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-16 h-16 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Processing</h1>
              <p className="text-lg text-gray-600 mb-8">We're waiting for JazzCash confirmation. This may take a few moments.</p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
              <p className="text-lg text-red-600 mb-8">Your payment could not be processed. Please try again.</p>
            </>
          )}

          {order && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg mb-4">Order Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Order #:</span> {order.orderNumber}</div>
                <div><span className="font-medium">Total:</span> Rs. {order.total?.toLocaleString()}</div>
                <div><span className="font-medium">Payment:</span> {order.paymentStatus.toUpperCase()}</div>
                <div><span className="font-medium">Status:</span> {order.orderStatus}</div>
                <div><span className="font-medium">Method:</span> JazzCash</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {status === 'success' && (
              <Link to="/products">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Continue Shopping
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <Button variant="outline" className="w-full border-gray-300">
                View Orders
              </Button>
            </Link>
            <Button onClick={fetchOrder} variant="ghost" className="w-full text-gray-600">
              Refresh Status
            </Button>
          </div>

          {status === 'error' && (
            <Button onClick={fetchOrder} className="w-full mt-4">
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

