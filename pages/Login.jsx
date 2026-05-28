import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../src/components/ui/card.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Label } from "../src/components/ui/label.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../src/redux/userSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/v1/users/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log("Response:", response.data);
      setLoading(false);
      
      if (response.data.success) {
        toast.success(response.data.message || "Login successful!");
        
        // Store token and dispatch user to Redux
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('token', response.data.accessToken);
          console.log('Login token saved:', response.data.accessToken.substring(0,20)+'...');
        }
        
        // Dispatch user data to Redux store (include role for admin access)
        dispatch(setUser({
          ...response.data.user,
          role: response.data.user.role || 'user'
        }));
        
        // Navigate to home page after successful login
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        toast.error(response.data.message || "Login failed!");
      }

    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred during login!";
      toast.error(errorMessage);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mx-auto pt-20 pb-20 flex justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 min-h-screen">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-black text-center">Login</CardTitle>
            <CardDescription className="text-lg text-black font-semibold text-center">
              <h3>Enter your credentials to access your account.</h3>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="text-gray-600 absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-gray-700 text-sm">Don't have an account? <Link to={'/signup'} className="hover:underline cursor-pointer text-pink-900">Signup here</Link></p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Login;

