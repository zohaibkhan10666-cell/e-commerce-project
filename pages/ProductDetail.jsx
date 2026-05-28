import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../src/components/ui/Navbar.jsx";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { addToCart } from "../src/redux/cartSlice";
import { Button } from "../src/components/ui/button.jsx";
import { Card, CardContent } from "../src/components/ui/card.jsx";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";

const API_BASE = "http://localhost:8000/api/v1";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await axios.get(`${API_BASE}/products/${id}`);
        if (res.data?.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
        } else {
          setErrorMsg(res.data?.message || "Product not found");
        }
      } catch (err) {
        console.error("Product detail fetch error:", err);
        setErrorMsg(err?.response?.data?.message || err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const discount = useMemo(() => {
    if (!product || !product.originalPrice) return 0;
    if (!product.originalPrice || !product.price) return 0;
    if (product.originalPrice <= 0) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" richColors />
      <div className="pt-24 pb-12 min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-pink-700 hover:text-pink-800 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Products
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-pulse rounded-3xl bg-white/70 shadow-2xl border border-white/50 h-[420px]" />
              <div className="space-y-4">
                <div className="animate-pulse h-10 bg-white/70 rounded-2xl shadow-2xl border border-white/50" />
                <div className="animate-pulse h-6 bg-white/70 rounded-2xl shadow-2xl border border-white/50 w-3/4" />
                <div className="animate-pulse h-24 bg-white/70 rounded-2xl shadow-2xl border border-white/50" />
                <div className="animate-pulse h-14 bg-white/70 rounded-2xl shadow-2xl border border-white/50" />
                <div className="animate-pulse h-14 bg-white/70 rounded-2xl shadow-2xl border border-white/50" />
              </div>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-24">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{errorMsg}</h1>
              <p className="text-gray-600">Please try again or go back to products.</p>
              <Button
                onClick={() => window.location.assign("/products")}
                className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-bold"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: image gallery (simple) */}
              <div>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/70">
                  <div className="aspect-square bg-gradient-to-br from-white to-slate-50">
                    <img
                      src={product?.images?.[0] || "https://via.placeholder.com/900?text=No+Image"}
                      alt={product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {product?.images?.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {product.images.slice(0, 4).map((img, idx) => (
                      <div
                        key={img + idx}
                        className="rounded-2xl overflow-hidden border border-white/50 bg-white/70 shadow-lg"
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div>
                <Card className="rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/70 backdrop-blur">
                  <CardContent className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 font-bold text-xs">
                            {product?.category}
                          </span>
                          {product?.brand && (
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 font-bold text-xs">
                              {product.brand}
                            </span>
                          )}
                        </div>

                        <h1 className="mt-3 text-3xl font-black text-gray-900 leading-tight">
                          {product?.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex -space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product?.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-gray-700">
                            ({product?.reviewCount || 0})
                          </span>
                        </div>
                      </div>

                      {product?.isFeatured && (
                        <span className="shrink-0 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-900 font-black">
                          ✨ Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-5 text-gray-700 text-base leading-relaxed">{product?.description}</p>

                    <div className="mt-6 flex items-baseline gap-3 pb-4 border-b border-gray-200/50">
                      <span className="text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{(product?.price ?? 0).toLocaleString()}
                      </span>
                      {product?.originalPrice && (
                        <>
                          <span className="text-lg font-medium text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md">
                              Save {discount}%
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (product?.stock || 0) > 10
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {product?.stock ?? 0} left
                      </span>
                      <span className="text-sm font-semibold text-gray-600">In stock</span>
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={handleAddToCart}
                        disabled={!product || (product?.stock ?? 0) <= 0}
                        className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl hover:shadow-2xl rounded-2xl"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                      </Button>
                    </div>

                    {/* Basic specs if present */}
                    {product?.specifications && (
                      <div className="mt-6">
                        <h3 className="font-black text-gray-900 mb-3">Specifications</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(product.specifications)
                            .filter(([, v]) => v)
                            .slice(0, 6)
                            .map(([k, v]) => (
                              <div key={k} className="rounded-2xl bg-white/80 border border-gray-200/50 p-3">
                                <div className="text-xs font-bold text-gray-600 capitalize">{k}</div>
                                <div className="text-sm font-semibold text-gray-900">{v}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Related */}
              <div className="md:col-span-2 mt-10">
                <h2 className="text-2xl font-black text-gray-900 mb-5">Related Products</h2>
                {relatedProducts?.length ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((rp) => (
                      <Link
                        key={rp._id}
                        to={`/products/${rp._id}`}
                        className="group rounded-3xl overflow-hidden border border-gray-200/50 bg-white/70 backdrop-blur shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                      >
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          <img
                            src={rp.images?.[0] || "https://via.placeholder.com/500?text=Product"}
                            alt={rp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <div className="text-xs font-bold text-gray-600">{rp.category}</div>
                          <div className="font-bold text-gray-900 mt-2 line-clamp-2">{rp.name}</div>
                          <div className="font-black text-pink-700 text-xl mt-3">₹{rp.price?.toLocaleString?.() ?? rp.price}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">No related products found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetail;

