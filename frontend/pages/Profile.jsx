import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { updateUser } from "../src/redux/userSlice.js";
import { User, Mail, Phone, MapPin, Home, Building, Hash, Edit, Camera, X, Save } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
    address2: "",
    city: "",
    zipCode: "",
    profilePic: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated || !user || isFetchingRef.current) {
        setLoading(false);
        return;
      }

      isFetchingRef.current = true;

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          isFetchingRef.current = false;
          setLoading(false);
          return;
        }

        const userId = user._id || user.id;
        const response = await axios.get(`http://localhost:8000/api/v1/users/get-users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.data.success) {
          const userData = response.data.user;
          setProfileData(userData);
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            phoneNo: userData.phoneNo || "",
            address: userData.address || "",
            address2: userData.address2 || "",
            city: userData.city || "",
            zipCode: userData.zipCode || "",
            profilePic: userData.profilePic || ""
          });
          setImagePreview(userData.profilePic || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (user) {
          setProfileData(user);
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNo: user.phoneNo || "",
            address: user.address || "",
            address2: user.address2 || "",
            city: user.city || "",
            zipCode: user.zipCode || "",
            profilePic: user.profilePic || ""
          });
          setImagePreview(user.profilePic || null);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProfileData();
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phoneNo: profileData.phoneNo || "",
        address: profileData.address || "",
        address2: profileData.address2 || "",
        city: profileData.city || "",
        zipCode: profileData.zipCode || "",
        profilePic: profileData.profilePic || ""
      });
      setImagePreview(profileData.profilePic || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('accessToken');
        dispatch({ type: 'user/logout' });
        navigate('/login');
        setIsSubmitting(false);
        return;
      }
      
      const payload = {
        firstName: formData.firstName || profileData?.firstName || user.firstName || "",
        lastName: formData.lastName || profileData?.lastName || user.lastName || "",
        phoneNo: formData.phoneNo || profileData?.phoneNo || user.phoneNo || "",
        address: formData.address || profileData?.address || user.address || "",
        address2: formData.address2 || profileData?.address2 || user.address2 || "",
        city: formData.city || profileData?.city || user.city || "",
        zipCode: formData.zipCode || profileData?.zipCode || user.zipCode || "",
        profilePic: formData.profilePic || profileData?.profilePic || user.profilePic || ""
      };

      const response = await axios.put(
        `http://localhost:8000/api/v1/users/update-profile`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        setProfileData(updatedUser);
        dispatch(updateUser(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Error updating profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <Toaster position="top-center" />
        <div className="max-w-md mx-auto text-center">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-10 pb-8">
              <User className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
              <p className="text-gray-600 mb-6">You need to login to view your profile.</p>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold px-8">
                  Login Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <Toaster position="top-center" />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600"></div>
        </div>
        <p className="text-center mt-4 text-white">Loading profile...</p>
      </div>
    );
  }

  const userData = profileData || user;
  const showProfileImage = imagePreview || (profileData && profileData.profilePic) || (user && user.profilePic);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto py-24 px-4 min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl mb-6">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4 relative">
                {showProfileImage ? (
                  <div className="relative">
                    <img 
                      src={imagePreview || profileData?.profilePic || user?.profilePic} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow-lg"
                    />
                    <button 
                      type="button"
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center border-4 border-pink-200 shadow-lg">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <button 
                      type="button"
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {isEditing ? (
                <div className="flex gap-2 justify-center mt-2">
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-32 text-center"
                  />
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-32 text-center"
                  />
                </div>
              ) : (
                <CardTitle className="text-3xl font-bold text-gray-800">
                  {userData.firstName} {userData.lastName}
                </CardTitle>
              )}
              <CardDescription className="text-lg text-gray-600">
                {userData.role === 'admin' ? 'Administrator' : 'Valued Customer'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-gray-800">Profile Details</CardTitle>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    onClick={handleEditClick}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-pink-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{userData.email}</span>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <Input
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="ml-2 h-8 w-40"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{userData.phoneNo || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-pink-500" />
                  Address Information
                </h3>
                <div className="space-y-3 pl-7">
                  {isEditing ? (
                    <>
                      <div className="flex items-start text-gray-600">
                        <Home className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <span className="font-medium">Address:</span>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                            className="ml-2 mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-start text-gray-600">
                        <Building className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <span className="font-medium">Address 2:</span>
                          <Input
                            name="address2"
                            value={formData.address2}
                            onChange={handleInputChange}
                            placeholder="Enter address 2"
                            className="ml-2 mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">City:</span>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="ml-2 h-8"
                          />
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Hash className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">Zip Code:</span>
                          <Input
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="Zip Code"
                            className="ml-2 h-8"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start text-gray-600">
                        <Home className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div>
                          <span className="font-medium">Address:</span>
                          <span className="ml-2">{userData.address || 'Not provided'}</span>
                        </div>
                      </div>
                      <div className="flex items-start text-gray-600">
                        <Building className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div>
                          <span className="font-medium">Address 2:</span>
                          <span className="ml-2">{userData.address2 || 'Not provided'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">City:</span>
                          <span className="ml-2">{userData.city || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Hash className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">Zip Code:</span>
                          <span className="ml-2">{userData.zipCode || 'Not provided'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-pink-500" />
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Email Verified:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${userData.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {userData.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Account Type:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${userData.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {userData.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link to="/home">
              <Button variant="ghost" className="text-gray-600 hover:text-pink-600">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

