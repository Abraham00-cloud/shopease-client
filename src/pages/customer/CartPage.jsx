import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';
import { cartService } from '../../api/cartService';
import { orderService } from '../../api/orderService';
import { paymentService } from '../../api/paymentService';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await cartService.updateCartItemQuantity(itemId, newQty);
      fetchCart();
    } catch (err) {
      alert('Failed to update item quantity.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeCartItem(itemId);
      fetchCart();
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  const handleCheckoutAndPay = async () => {
    setCheckoutLoading(true);
    try {
      // 1. Create order from cart
      const order = await orderService.createOrder();
      const orderId = order.id || order.orderId;

      // 2. Initialize Paystack payment
      const paymentRes = await paymentService.initializePayment(orderId);

      if (paymentRes.authorization_url || paymentRes.data?.authorization_url) {
        const paystackUrl = paymentRes.authorization_url || paymentRes.data.authorization_url;
        window.location.href = paystackUrl; // Redirect to Paystack secure checkout
      } else {
        alert('Order placed successfully! Check My Orders page for payment link.');
        navigate('/orders/mine');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const items = cart?.items || cart?.cartItems || [];
  const totalPrice = cart?.totalAmount || items.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-indigo-600" />
        <span>Shopping Cart</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">Looks like you haven&apos;t added any items yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 font-bold">
                    {item.productName ? item.productName[0] : 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.productName || 'Product'}</h4>
                    <p className="text-indigo-600 font-extrabold text-sm mt-0.5">
                      ₦{Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span>₦{Number(totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-slate-900 text-base">
                <span>Total</span>
                <span>₦{Number(totalPrice).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutAndPay}
              disabled={checkoutLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>{checkoutLoading ? 'Redirecting to Paystack...' : 'Pay with Paystack'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;