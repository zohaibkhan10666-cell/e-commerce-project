import React, { useState, useEffect } from "react";
import Navbar from "../src/components/ui/Navbar.jsx";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { addToCart } from "../src/redux/cartSlice";
import { Card, CardContent } from "../src/components/ui/card.jsx";
import { Button } from "../src/components/ui/button.jsx";
import { Input } from "../src/components/ui/input.jsx";
import { Link } from "react-router-dom";
import { Search, Filter, Star, ShoppingCart, Grid, List } from "lucide-react";


function Products() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    brand: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      params.append("page", pagination.page);
      params.append("limit", 12);

      const response = await axios.get(
        `http://localhost:8000/api/v1/products?${params.toString()}`
      );

      if (response.data.success) {
        setProducts(response.data.products);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
        
        if (response.data.filters) {
          setCategories(response.data.filters.categories || []);
          setBrands(response.data.filters.brands || []);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      
      setProducts(getDemoProducts());
      setPagination({ page: 1, pages: 1, total: 6 });
      setCategories(["Electronics", "Clothing", "Home & Garden", "Sports"]);
      setBrands(["TechBrand", "FashionCo", "HomeStyle", "SportPro"]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/products/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log("Using default categories");
    }
  };

  const getDemoProducts = () => [
    {
      _id: "1",
      name: "Wireless Bluetooth Headphones",
      description: "Premium sound quality with active noise cancellation and 24hr battery life",
      price: 2999,
      originalPrice: 4999,
      category: "Electronics",
      brand: "TechBrand",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
      rating: 4.5,
      reviewCount: 128,
      stock: 50,
      isFeatured: true
    },
    {
      _id: "2",
      name: "Smart Watch Pro",
      description: "Fitness tracking with heart rate monitor and GPS navigation",
      price: 5999,
      originalPrice: 7999,
      category: "Electronics",
      brand: "TechBrand",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
      rating: 4.8,
      reviewCount: 256,
      stock: 30,
      isFeatured: true
    },
    {
      _id: "3",
      name: "Running Shoes Air Max",
      description: "Comfortable and lightweight for daily running with breathable mesh",
      price: 1999,
      originalPrice: 2999,
      category: "Sports",
      brand: "SportPro",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
      rating: 4.3,
      reviewCount: 89,
      stock: 100,
      isFeatured: false
    },
    {
      _id: "4",
      name: "Cotton T-Shirt Pack",
      description: "Premium cotton, set of 3 colors, regular fit for everyday wear",
      price: 999,
      originalPrice: 1499,
      category: "Clothing",
      brand: "FashionCo",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
      rating: 4.1,
      reviewCount: 67,
      stock: 200,
      isFeatured: false
    },
    {
      _id: "5",
      name: "Modern Table Lamp",
      description: "LED desk lamp with touch control and adjustable brightness levels",
      price: 1499,
      originalPrice: 2499,
      category: "Home & Garden",
      brand: "HomeStyle",
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
      rating: 4.6,
      reviewCount: 45,
      stock: 75,
      isFeatured: true
    },
    {
      _id: "6",
      name: "Wireless Mouse",
      description: "Ergonomic design with precision tracking and long battery life",
      price: 799,
      originalPrice: 1299,
      category: "Electronics",
      brand: "TechBrand",
      images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"],
      rating: 4.4,
      reviewCount: 112,
      stock: 150,
      isFeatured: false
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      brand: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.brand;

  const handleUnder3000Filter = (checked) => {
    if (checked) {
      handleFilterChange("maxPrice", "3000");
      handleFilterChange("minPrice", "0");
    } else {
      handleFilterChange("maxPrice", "");
      handleFilterChange("minPrice", "");
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" richColors />
      <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-50 via-pink-50 to-purple-50">
        <div className="backdrop-blur-xl bg-white/95 shadow-2xl border-b border-white/30 sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl mb-1">
                  All Products
                </h1>
                <p className="text-lg text-gray-600 font-semibold">
                  {pagination.total} premium items found
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch">
                <div className="relative flex-1 min-w-0 backdrop-blur-xl group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <Input
                    type="text"
                    placeholder="Search 10,000+ products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-14 h-14 w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-2xl hover:shadow-3xl group-hover:shadow-4xl focus:shadow-4xl focus:ring-4 focus:ring-pink-500/30 focus:border-transparent transition-all duration-500 font-medium text-lg"
                  />
                </div>
                
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 px-6 backdrop-blur-xl bg-white/80 hover:bg-white shadow-2xl hover:shadow-4xl border border-pink-200/50 text-pink-700 hover:text-pink-900 font-bold rounded-3xl transition-all duration-300 flex items-center gap-2 shadow-lg whitespace-nowrap"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shadow-lg animate-pulse">
                      {Object.values(filters).filter(Boolean).length}
                    </span>
                  )}
                </Button>
                
                <div className="flex bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200/50 p-1.5 divide-x divide-gray-200/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${viewMode === "grid" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl" : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"}`}
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${viewMode === "list" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl" : "text-gray-700 hover:bg-gray-100 hover:text-pink-600"}`}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className={`lg:flex lg:gap-6 ${showFilters ? '' : 'justify-center'}`}>
            {showFilters && (
              <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-48 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-pink-50/80 to-purple-50/80 p-5 border-b border-white/30">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                          Advanced Filters
                        </h2>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="bg-gradient-to-r from-pink-400/80 to-purple-400/80 hover:from-pink-500 hover:to-purple-500 text-white font-semibold backdrop-blur shadow-xl hover:shadow-2xl px-4 py-1.5 rounded-2xl text-xs transition-all"
                          >
                            Clear ({Object.values(filters).filter(Boolean).length})
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 font-medium opacity-90">Refine your perfect match</p>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-800 mb-2 block uppercase tracking-wide">
                          Category
                        </label>
                        <select
                          value={filters.category}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                          className="w-full p-3 border border-gray-200/50 rounded-xl bg-white/80 hover:bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-pink-500/30 focus:border-transparent transition-all font-medium text-sm"
                        >
                          <option value="">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-800 mb-2 block uppercase tracking-wide">
                          Price
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                            className="h-10 p-3 rounded-xl border border-gray-200/50 bg-white/80 hover:shadow-md focus:ring-2 focus:ring-emerald-500/30 shadow-md transition-all font-medium text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                            className="h-10 p-3 rounded-xl border border-gray-200/50 bg-white/80 hover:shadow-md focus:ring-2 focus:ring-emerald-500/30 shadow-md transition-all font-medium text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-800 mb-2 block uppercase tracking-wide">
                          Brand
                        </label>
                        <select
                          value={filters.brand}
                          onChange={(e) => handleFilterChange("brand", e.target.value)}
                          className="w-full p-3 border border-gray-200/50 rounded-xl bg-white/80 hover:bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all font-medium text-sm"
                        >
                          <option value="">All Brands</option>
                          {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-800 mb-2 block uppercase tracking-wide">
                          Sort
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="p-3 border border-gray-200/50 rounded-xl bg-white/80 hover:bg-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-purple-500/30 transition-all font-medium text-sm"
                          >
                            <option value="createdAt">Newest</option>
                            <option value="price">Price Low</option>
                            <option value="-price">Price High</option>
                            <option value="rating">Rating</option>
                          </select>
                          <Button onClick={fetchProducts} size="sm" className="h-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl font-semibold text-white rounded-xl transition-all text-xs">
                            Update
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-800 mb-3 block uppercase tracking-wide">
                          Quick Filters
                        </label>
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 hover:border-pink-300 hover:shadow-md backdrop-blur cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={filters.featured === "true"}
                              onChange={(e) => handleFilterChange("featured", e.target.checked ? "true" : "")}
                              className="w-4 h-4 rounded border-2 border-pink-400 bg-white shadow-sm focus:ring-2 focus:ring-pink-500 flex-shrink-0"
                            />
                            <div>Featured</div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 hover:border-emerald-300 hover:shadow-md backdrop-blur cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={filters.maxPrice === "3000" && filters.minPrice === "0"}
                              onChange={(e) => handleUnder3000Filter(e.target.checked)}
                              className="w-4 h-4 rounded border-2 border-emerald-400 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
                            />
                            <div>Under ₹3K</div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 hover:border-yellow-300 hover:shadow-md backdrop-blur cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              onChange={(e) => handleFilterChange("rating", e.target.checked ? "4" : "")}
                              className="w-4 h-4 rounded border-2 border-yellow-400 bg-white shadow-sm focus:ring-2 focus:ring-yellow-500 flex-shrink-0"
                            />
                            <div>4+ ⭐</div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            )}

            <main className="flex-1 min-h-[70vh]">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-16">
                  {Array(12).fill().map((_, i) => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="aspect-square bg-gradient-to-br from-gray-200/70 to-gray-300/70 rounded-2xl shadow-lg"></div>
                      <div className="h-4 bg-gray-300/70 rounded w-3/4"></div>
                      <div className="flex gap-1">
                        {Array(5).fill().map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-gray-300/70 rounded-full"></div>
                        ))}
                      </div>
                      <div className="h-12 bg-gray-300/70 rounded-2xl w-full"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-6 shadow-xl animate-pulse">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">No products match</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-md">Try different search or filter options</p>
                  <Button onClick={clearFilters} size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-xl px-8 py-3 rounded-2xl font-bold text-lg">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className={`transition-all duration-700 ${viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-6"
                  }`}>
                    {products.map((product, index) => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        viewMode={viewMode}
                        index={index}
                      />
                    ))}
                  </div>

                  {pagination.pages > 1 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center mt-20 mb-16 p-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-4xl mx-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="px-6 py-2.5 backdrop-blur bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border-gray-300 rounded-2xl font-semibold transition-all text-sm min-w-[100px]"
                      >
                        ← Previous
                      </Button>
                      
                      <div className="flex gap-1 bg-white/80 backdrop-blur p-2 rounded-2xl shadow-xl border border-gray-200/50">
                        {[...Array(Math.min(7, pagination.pages))].map((_, i) => {
                          const pageNum = Math.max(1, Math.min(pagination.pages, pagination.page - 2 + i));
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 font-bold rounded-xl shadow-md transition-all text-sm min-w-[36px] ${pagination.page === pageNum 
                                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl" 
                                : "bg-white/90 backdrop-blur hover:bg-white shadow-lg hover:shadow-xl border border-gray-300/50 text-gray-800 hover:text-pink-600"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.pages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="px-6 py-2.5 backdrop-blur bg-white/90 hover:bg-white shadow-lg hover:shadow-xl border-gray-300 rounded-2xl font-semibold transition-all text-sm min-w-[100px]"
                      >
                        Next →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCard({ product, viewMode, index }) {
  const dispatch = useDispatch();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const animationDelay = index * 75;

  if (viewMode === "list") {
    return (
      <div className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-3xl overflow-hidden border border-gray-200/50 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm shadow-xl animate-[slideInUp_0.5s_ease-out]">
        <div className="p-6">
          <div className="flex gap-6">
            <div className="w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-xl ring-2 ring-white/50">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-2xl"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 py-2">
              <div className="flex items-start gap-2 mb-4">
                <span className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 font-bold text-xs rounded-full shadow-sm">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 font-bold text-xs rounded-full shadow-md animate-pulse">
                    ✨ Featured
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2 text-gray-900 drop-shadow-sm group-hover:text-pink-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                {product.description}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 drop-shadow-sm ${i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400 shadow-md"
                        : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700 ml-1">({product.reviewCount})</span>
                <div className="ml-auto">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${product.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {product.stock} left
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-3 pb-5 mb-5 border-b border-gray-200/30">
                <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg font-medium text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs rounded-full shadow-md">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur border-0 transform hover:scale-[1.01] transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden border border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-xl animate-[slideInUp_0.4s_ease-out]">
      <div className="overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-50/50 to-gray-100 overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400?text=Product"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-xl"
            loading="lazy"
          />
        </div>
        {discount > 0 && (
          <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-2xl shadow-xl backdrop-blur animate-pulse">
            {discount}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-4 right-4 z-20 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-2xl shadow-xl backdrop-blur animate-bounce">
            ✨ Featured
          </span>
        )}
      </div>
      <CardContent className="p-5">
        <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 font-bold text-xs rounded-full shadow-md mb-3 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-bold text-base leading-tight line-clamp-2 mb-2 group-hover:text-pink-600 transition-all text-gray-900">
          <Link to={`/products/${product._id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex -space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400 shadow-sm"
                  : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-baseline gap-2 pb-4 mb-4 border-b border-gray-200/30">
          <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-lg font-medium text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl rounded-2xl backdrop-blur border-0 transform hover:scale-[1.01] transition-all duration-300"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </div>
  );
}

export default Products;

