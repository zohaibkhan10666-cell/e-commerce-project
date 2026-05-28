import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { CheckCircle } from 'lucide-react';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and token from navigation state
  const email = location.state?.email || '';
  const token = location.state?.token || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 5) {
      toast.error('Please enter a valid 5-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/verify', {
        email: email,
        otp: otp
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className='relative w-full h-screen overflow-hidden'>
        <div className='flex flex-col items-center justify-center min-h-screen bg-pink-100 px-4'>
          <div className='bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center'>
            <div className='flex justify-center mb-3'>
              <CheckCircle className='w-10 h-10 text-green-500' />
            </div>
            <h2 className='text-xl font-semibold text-green-600 mb-3'>Verify Your Email</h2>
            <p className='text-gray-600 text-xs mb-4'>
              We have sent a 5-digit verification code to your email. 
              Please enter it below to verify your account.
            </p>
            
            <form onSubmit={handleVerify} className='space-y-3'>
              <input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder='Enter 5-digit OTP'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-base tracking-widest'
                maxLength={5}
                required
              />
              
              <button
                type='submit'
                disabled={loading || otp.length !== 5}
                className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 text-sm'
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className='mt-3 text-xs text-gray-500'>
              <p>
                Didn't receive the code? 
                <Link to='/signup' className='text-green-600 hover:underline ml-1'>
                  Resend OTP
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;
