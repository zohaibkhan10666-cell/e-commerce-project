import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { 
    ShoppingCart, 
    Search, 
    ChevronLeft,
    ChevronRight,
    Eye,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    X
} from "lucide-react";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, search, statusFilter, paymentFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', 10);
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (paymentFilter) params.append('paymentStatus', paymentFilter);

            const response = await axios.get(
                `http://localhost:8000/api/v1/admin/orders?${params.toString()}`,
                {
                    headers: { authorization: `Bearer ${accessToken}` }
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders(getDemoOrders());
            setPagination({ page: 1, pages: 1, total: 3 });
        } finally {
            setLoading(false);
        }
    };

    const getDemoOrders = () => [
        {
            _id: "1",
            orderNumber: "ORD-202401-00001",
            user: { name: "John Doe", email: "john@example.com" },
            total: 5999,
            orderStatus: "processing",
            paymentStatus: "paid",
            createdAt: "2024-01-20T10:30:00Z",
            items: [{ name: "Smart Watch", price: 5999, quantity: 1 }]
        },
        {
            _id: "2",
            orderNumber: "ORD-202401-00002",
            user: { name: "Jane Smith", email: "jane@example.com" },
            total: 2999,
            orderStatus: "shipped",
            paymentStatus: "paid",
            createdAt: "2024-01-19T15:20:00Z",
            items: [{ name: "Headphones", price: 2999, quantity: 1 }]
        },
        {
            _id: "3",
            orderNumber: "ORD-202401-00003",
            user: { name: "Bob Wilson", email: "bob@example.com" },
            total: 1500,
            orderStatus: "pending",
            paymentStatus: "pending",
            createdAt: "2024-01-21T09:00:00Z",
            items: [{ name: "T-Shirt", price: 500, quantity: 3 }]
        }
    ];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/orders/${orderId}/status`,
                { orderStatus: newStatus },
                { headers: { authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handlePaymentChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/orders/${orderId}/payment`,
                { paymentStatus: newStatus },
                { headers: { authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating payment:", error);
            toast.error(error.response?.data?.message || "Failed to update payment");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-4 h-4" />,
            confirmed: <CheckCircle className="w-4 h-4" />,
            processing: <Package className="w-4 h-4" />,
            shipped: <Truck className="w-4 h-4" />,
            delivered: <CheckCircle className="w-4 h-4" />,
            cancelled: <XCircle className="w-4 h-4" />
        };
        return icons[status] || <Clock className="w-4 h-4" />;
    };

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

    const getPaymentColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Toaster position="top-center" richColors />
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                            <p className="text-gray-600">Manage and track all orders</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="">All Payments</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            All Orders ({pagination.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-pink-600"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No orders found</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3 font-semibold text-gray-600">Order</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Customer</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Items</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Total</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Payment</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <span className="font-medium text-gray-800">{order.orderNumber}</span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{order.user?.name}</p>
                                                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {order.items?.length || 0} items
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="font-medium text-gray-800">₹{order.total?.toLocaleString()}</span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.orderStatus)}`}>
                                                            {getStatusIcon(order.orderStatus)}
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                                                                <select
                                                                    value={order.orderStatus}
                                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                    className="text-xs p-1 border rounded"
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancel</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <p className="text-sm text-gray-500">
                                            Showing {((pagination.page - 1) * 10) + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pagination.page === 1}
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            {[...Array(pagination.pages)].map((_, i) => (
                                                <Button
                                                    key={i + 1}
                                                    variant={pagination.page === i + 1 ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(i + 1)}
                                                    className={pagination.page === i + 1 ? "bg-pink-600" : ""}
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pagination.page === pagination.pages}
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Order Details - {selectedOrder.orderNumber}</CardTitle>
                            <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Customer Info */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Customer Information</h3>
                                <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                {selectedOrder.shippingAddress && (
                                    <>
                                        <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNo}</p>
                                    </>
                                )}
                            </div>

                            {/* Items */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Order Items</h3>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <p className="font-medium">₹{item.subtotal?.toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="mt-4 pt-2 border-t">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{selectedOrder.shippingCost || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>₹{selectedOrder.tax || 0}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg mt-2">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Order Status</label>
                                    <select
                                        value={selectedOrder.orderStatus}
                                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Payment Status</label>
                                    <select
                                        value={selectedOrder.paymentStatus}
                                        onChange={(e) => handlePaymentChange(selectedOrder._id, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;

