import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Label } from "../src/components/ui/label.jsx";
import { 
    Package, 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft,
    ChevronRight,
    X,
    Image as ImageIcon
} from "lucide-react";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        brand: "",
        stock: "",
        images: [],
        isFeatured: false
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [pagination.page, search, categoryFilter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page);
            params.append('limit', 12);
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await axios.get(
                `http://localhost:8000/api/v1/products?${params.toString()}`,
                {
                    headers: { authorization: `Bearer ${accessToken}` }
                }
            );

            if (response.data.success) {
                setProducts(response.data.products);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts(getDemoProducts());
            setPagination({ page: 1, pages: 1, total: 6 });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/products/categories");
            if (response.data.success) {
                setCategories(response.data.categories || []);
            }
        } catch (error) {
            console.log("Using default categories");
            setCategories(["Electronics", "Clothing", "Home & Garden", "Sports"]);
        }
    };

    const getDemoProducts = () => [
        { _id: "1", name: "Wireless Headphones", price: 2999, category: "Electronics", stock: 50, isFeatured: true, images: [] },
        { _id: "2", name: "Smart Watch", price: 5999, category: "Electronics", stock: 30, isFeatured: true, images: [] },
        { _id: "3", name: "Running Shoes", price: 1999, category: "Sports", stock: 100, isFeatured: false, images: [] },
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            originalPrice: "",
            category: "",
            brand: "",
            stock: "",
            images: [],
            isFeatured: false
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            originalPrice: product.originalPrice || "",
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock || "",
            images: product.images || [],
            isFeatured: product.isFeatured || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productData = {
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            stock: Number(formData.stock)
        };

        try {
            let response;
            if (editingProduct) {
                response = await axios.put(
                    `http://localhost:8000/api/v1/products/${editingProduct._id}`,
                    productData,
                    { headers: { authorization: `Bearer ${accessToken}` } }
                );
            } else {
                response = await axios.post(
                    'http://localhost:8000/api/v1/products',
                    productData,
                    { headers: { authorization: `Bearer ${accessToken}` } }
                );
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                fetchProducts();
            }
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.response?.data?.message || "Failed to save product");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/products/${productId}`,
                { headers: { authorization: `Bearer ${accessToken}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(error.response?.data?.message || "Failed to delete product");
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
                            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                            <p className="text-gray-600">Manage your products inventory</p>
                        </div>
                        <Button onClick={openAddModal} className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
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
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No products found</p>
                        <Button onClick={openAddModal} className="mt-4 bg-pink-600 hover:bg-pink-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Product
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Card key={product._id} className="overflow-hidden">
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.images?.[0] ? (
                                            <img 
                                                src={product.images[0]} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}
                                        {product.isFeatured && (
                                            <span className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-pink-600 font-medium">{product.category}</p>
                                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-lg font-bold text-pink-600">₹{product.price?.toLocaleString()}</span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through ml-2">
                                                        ₹{product.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                product.stock > 10 ? 'bg-green-100 text-green-800' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => openEditModal(product)}
                                                className="flex-1"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    className="border-pink-300"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={pagination.page === i + 1 ? "default" : "outline"}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={pagination.page === i + 1 ? "bg-pink-600" : "border-pink-300"}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    className="border-pink-300"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                            <Button variant="ghost" onClick={() => setShowModal(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label>Product Name *</Label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label>Description *</Label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter product description"
                                            className="w-full p-2 border rounded-md min-h-[100px]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Price *</Label>
                                        <Input
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Original Price</Label>
                                        <Input
                                            name="originalPrice"
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Category *</Label>
                                        <Input
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Electronics"
                                            list="categories"
                                            required
                                        />
                                        <datalist id="categories">
                                            {categories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <Label>Brand</Label>
                                        <Input
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Samsung"
                                        />
                                    </div>
                                    <div>
                                        <Label>Stock *</Label>
                                        <Input
                                            name="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Image URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                name="imageUrl"
                                                value={formData.imageUrl || ""}
                                                onChange={handleImageChange}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {formData.images.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="relative w-16 h-16">
                                                        <img src={img} alt="" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={handleInputChange}
                                                className="rounded"
                                            />
                                            <span className="text-sm font-medium">Mark as Featured</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;

