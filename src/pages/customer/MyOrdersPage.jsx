import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { orderService } from '../../api/orderService';
import { paymentService } from '../../api/paymentService';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders(0, 20);
      setOrders(data.content || data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (orderId) => {
    try {
      const paymentRes = await paymentService.initializePayment(orderId);
      const url = paymentRes.authorization_url || paymentRes.data?.authorization_url;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      alert('Failed to initialize Paystack payment.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>{status}</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="h-3 w-3" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span>{status}</span>
          </span>
        );
    }
  };

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
        <Package className="h-6 w-6 text-indigo-600" />
        <span>My Order History</span>
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No orders found</h3>
          <p className="text-slate-500 text-sm mt-1">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-base">
                    Order #{order.id}
                  </span>
                  {getStatusBadge(order.status || 'PENDING')}
                </div>
                <p className="text-xs text-slate-500">
                  Placed on: {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : 'Recent'}
                </p>
                <div className="text-sm font-extrabold text-slate-800 pt-1">
                  Total: ₦{Number(order.totalAmount || 0).toLocaleString()}
                </div>
              </div>

              {order.status === 'PENDING' && (
                <button
                  onClick={() => handlePayNow(order.id)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors w-fit"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Complete Paystack Payment</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;