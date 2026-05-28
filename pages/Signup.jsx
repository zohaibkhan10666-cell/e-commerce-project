import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../src/components/ui/card.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Label } from "../src/components/ui/label.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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
      const response = await axios.post(`http://localhost:8000/api/v1/users/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log("Response:", response.data);
      setLoading(false);
      
      if (response.data.success) {
        toast.success(response.data.message || "Signup successful! Please check your email for OTP.");
        setTimeout(() => {
          navigate('/verify', { state: { email: formData.email, token: response.data.token } });
        }, 1500);
      } else {
        toast.error(response.data.message || "Signup failed!");
      }

    } catch (error) {
      setLoading(false);
      console.error("Error during signup:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred during signup!";
      toast.error(errorMessage);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Toaster />
      <div className="container mx-auto py-20 flex justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 min-h-screen">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-black text-center">Signup</CardTitle>
          <CardDescription className="text-lg text-black font-semibold text-center">
            <h3>Create your account to get started.</h3>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
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
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-gray-700 text-sm">Already have an account?
            <Link to={'/login'} className="hover:underline cursor-pointer text-pink-900">Login here</Link></p>
        </CardFooter>
      </Card>
      </div>
    </>
  );
}

export default Signup;

