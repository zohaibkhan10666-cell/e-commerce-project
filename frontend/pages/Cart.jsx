
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../src/redux/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "../src/components/ui/button.jsx";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // JazzCash Configuration - Replace with your actual credentials
  const jazzCashConfig = {
    merchantId: "MC46312",
    password: "y6w3m92d5g",
    returnUrl: "http://localhost:5173/payment-success",
    jazzCashUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/index.shtml"
  };

  const generateSecureHash = (amount, txnRefNo) => {
    const { merchantId, password } = jazzCashConfig;
    const data = amount + txnRefNo + merchantId + password;
    let hash = "";
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return hash.toString(16);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
      toast.success("Item removed from cart");
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const formatPrice = (price) => {
    return "Rs. " + price.toLocaleString();
  };

  const getShipping = () => {
    if (totalPrice === 0) return 0;
    return totalPrice > 5000 ? 0 : 250;
  };

  const shipping = getShipping();
  const total = totalPrice + shipping;

  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate('/checkout');
  };



  const handleJazzCashPayment = (e) => {
    e.preventDefault();

    const orderId = "ORD-" + Date.now();
    const amount = total.toString();

    const pp_Amount = amount;
    const pp_TxnType = "MPAY";
    const pp_Language = "EN";
    const pp_MerchantID = jazzCashConfig.merchantId;
    const pp_ProductID = "PRODUCT-123";
    const pp_SubMerchantID = "";
    const pp_Password = jazzCashConfig.password;
    const pp_TxnRefNo = orderId;
    const pp_ReturnURL = jazzCashConfig.returnUrl;
    const pp_SecureHash = generateSecureHash(pp_Amount, pp_TxnRefNo);

    // Create form and submit
    const form = document.getElementById("jazzcash-form");
    if (form) {
      form.submit();
    }
  };

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <img src="/kart.png" alt="cart" className="w-32 h-32 mx-auto mb-4 drop-shadow-md" />
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <p className="text-gray-500 mt-2">0 items in cart</p>
            <Link to="/products" className="inline-block mt-6 bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingOut) {
    const orderId = "ORD-" + Date.now();
    const pp_Amount = total.toString();
    const pp_TxnType = "MPAY";
    const pp_Language = "EN";
    const pp_MerchantID = jazzCashConfig.merchantId;
    const pp_ProductID = "PRODUCT-123";
    const pp_SubMerchantID = "";
    const pp_Password = jazzCashConfig.password;
    const pp_TxnRefNo = orderId;
    const pp_ReturnURL = jazzCashConfig.returnUrl;
    const pp_SecureHash = generateSecureHash(pp_Amount, pp_TxnRefNo);

    return (
      <div className="pt-24 pb-12 min-h-screen bg-pink-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <img src="/kart.png" alt="logo" className="w-16 h-auto drop-shadow-md" />
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            </div>

            <div className="mb-6 p-4 bg-pink-50 rounded-lg">
              <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-pink-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method: JazzCash
              </h2>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  You will be redirected to JazzCash secure payment gateway to complete your payment.
                </p>

                <form
                  id="jazzcash-form"
                  action={jazzCashConfig.jazzCashUrl}
                  method="post"
                  target="_blank"
                >
                  <input type="hidden" name="pp_Amount" value={pp_Amount} />
                  <input type="hidden" name="pp_TxnType" value={pp_TxnType} />
                  <input type="hidden" name="pp_Language" value={pp_Language} />
                  <input type="hidden" name="pp_MerchantID" value={pp_MerchantID} />
                  <input type="hidden" name="pp_ProductID" value={pp_ProductID} />
                  <input type="hidden" name="pp_SubMerchantID" value={pp_SubMerchantID} />
                  <input type="hidden" name="pp_Password" value={pp_Password} />
                  <input type="hidden" name="pp_TxnRefNo" value={pp_TxnRefNo} />
                  <input type="hidden" name="pp_ReturnURL" value={pp_ReturnURL} />
                  <input type="hidden" name="pp_SecureHash" value={pp_SecureHash} />
                </form>

                <Button
                  onClick={handleJazzCashPayment}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay {formatPrice(total)} with JazzCash
                </Button>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(false)}
              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <img src="/kart.png" alt="logo" className="w-16 h-auto drop-shadow-md" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                <div className="w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg ring-1 ring-pink-200/50">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/400x400/ f8fafc/6b7280?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 text-pink-600" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-pink-600" />
                      </button>
                    </div>
                    <span className="text-lg font-bold text-pink-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-green-600">Free shipping on orders over Rs. 5,000</p>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-pink-600">{formatPrice(total)}</span>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full border-pink-300 text-pink-600 hover:bg-pink-50">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-2">Accepted Payment Methods</p>
                <div className="flex justify-center gap-2 text-gray-400">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs">Visa, Mastercard, JazzCash, EasyPaisa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

