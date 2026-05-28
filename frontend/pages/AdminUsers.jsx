import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { 
    Users, 
    Search, 
    Shield, 
    ShieldOff, 
    Trash2, 
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    UserPlus
} from "lucide-react";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, search, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', 10);
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);

            const response = await axios.get(
                `http://localhost:8000/api/v1/admin/users?${params.toString()}`,
                {
                    headers: { authorization: `Bearer ${accessToken}` }
                }
            );

            if (response.data.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
            // Demo data
            setUsers(getDemoUsers());
            setPagination({ page: 1, pages: 1, total: 5 });
        } finally {
            setLoading(false);
        }
    };

    const getDemoUsers = () => [
        { _id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", role: "user", isVerified: true, createdAt: "2024-01-15" },
        { _id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "admin", isVerified: true, createdAt: "2024-01-10" },
        { _id: "3", firstName: "Bob", lastName: "Wilson", email: "bob@example.com", role: "user", isVerified: false, createdAt: "2024-01-20" },
    ];

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchUsers();
            }
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/admin/users/${userId}`,
                { headers: { authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchUsers();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <Toaster position="top-center" richColors />
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                            <p className="text-gray-600">Manage all registered users</p>
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
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            All Users ({pagination.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-pink-600"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No users found</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3 font-semibold text-gray-600">User</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Email</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Role</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Verified</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Joined</th>
                                                <th className="text-left p-3 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                                <span className="text-pink-600 font-medium">
                                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-gray-800">
                                                                {user.firstName} {user.lastName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-gray-600">{user.email}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.role === 'admin' 
                                                                ? 'bg-purple-100 text-purple-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.isVerified 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {user.isVerified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            {user.role === 'user' ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleRoleChange(user._id, 'admin')}
                                                                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                                                >
                                                                    <Shield className="w-4 h-4" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleRoleChange(user._id, 'user')}
                                                                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                                                                >
                                                                    <ShieldOff className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
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
        </div>
    );
}

export default AdminUsers;

