import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { 
    Users, 
    Package, 
    ShoppingCart, 
    DollarSign, 
    TrendingUp, 
    AlertTriangle,
    ArrowRight,
    Store,
    UserPlus,
    ClipboardList
} from "lucide-react";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/admin/dashboard', {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to load dashboard statistics");
            // Demo data for testing
            setStats(getDemoStats());
        } finally {
            setLoading(false);
        }
    };

    const getDemoStats = () => ({
        totalUsers: 156,
        totalProducts: 89,
        totalOrders: 234,
        activeProducts: 75,
        lowStockProducts: 12,
        revenue: 456780,
        totalCompletedOrders: 198,
        avgOrderValue: 2306,
        recentOrders: [],
        recentUsers: [],
        ordersByStatus: [
            { _id: 'pending', count: 15 },
            { _id: 'processing', count: 8 },
            { _id: 'shipped', count: 12 },
            { _id: 'delivered', count: 180 }
        ],
        topProducts: []
    });

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Toaster position="top-center" richColors />
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                            <p className="text-gray-600">Welcome to the admin panel</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/admin/products">
                                <Button className="bg-pink-600 hover:bg-pink-700">
                                    <Package className="w-4 h-4 mr-2" />
                                    Manage Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Link to="/admin/dashboard">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-pink-50 border-pink-200">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Dashboard</p>
                                    <p className="text-sm text-gray-500">Overview</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/admin/users">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-blue-50 border-blue-200">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Users</p>
                                    <p className="text-sm text-gray-500">Manage Users</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/admin/products">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-purple-50 border-purple-200">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Products</p>
                                    <p className="text-sm text-gray-500">Manage Products</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/admin/orders">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-orange-50 border-orange-200">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Orders</p>
                                    <p className="text-sm text-gray-500">Manage Orders</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        title="Total Users" 
                        value={stats?.totalUsers || 0} 
                        icon={<Users className="w-6 h-6 text-blue-600" />}
                        trend="+12%"
                        color="blue"
                    />
                    <StatCard 
                        title="Total Products" 
                        value={stats?.totalProducts || 0} 
                        icon={<Store className="w-6 h-6 text-purple-600" />}
                        trend="+5%"
                        color="purple"
                    />
                    <StatCard 
                        title="Total Orders" 
                        value={stats?.totalOrders || 0} 
                        icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
                        trend="+18%"
                        color="orange"
                    />
                    <StatCard 
                        title="Total Revenue" 
                        value={`₹${(stats?.revenue || 0).toLocaleString()}`} 
                        icon={<DollarSign className="w-6 h-6 text-green-600" />}
                        trend="+25%"
                        color="green"
                    />
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Products</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.activeProducts || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Low Stock Items</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats?.lowStockProducts || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-800">₹{stats?.avgOrderValue?.toFixed(2) || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-pink-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                            <Link to="/admin/orders">
                                <Button variant="ghost" size="sm" className="text-pink-600">
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {stats?.recentOrders?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentOrders.map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">{order.orderNumber}</p>
                                                <p className="text-sm text-gray-500">{order.user?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-800">₹{order.total?.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent orders</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
                            <Link to="/admin/users">
                                <Button variant="ghost" size="sm" className="text-pink-600">
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {stats?.recentUsers?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentUsers.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                    <UserPlus className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent users</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Status Overview */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {stats?.ordersByStatus?.map((item) => (
                                <div key={item._id} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                                    <p className="text-sm text-gray-500 capitalize">{item._id}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, trend, color }) {
    const colorClasses = {
        blue: 'bg-blue-50',
        purple: 'bg-purple-50',
        orange: 'bg-orange-50',
        green: 'bg-green-50'
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                        {trend && (
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {trend} from last month
                            </p>
                        )}
                    </div>
                    <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default AdminDashboard;

