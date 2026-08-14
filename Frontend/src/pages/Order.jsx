import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { PackageSearch, CheckCircle2, XCircle, Download } from 'lucide-react';
import orderService from '../api/orderService';
import { useAuth } from '../components/AuthContext';
import { generateReceiptPDF } from '../utils/Generatereceipt';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const Orders = () => {
  const location = useLocation();
  const { user } = useAuth();
  const justPlacedOrderId = location.state?.justPlacedOrderId;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    orderService
      .getOrders({ user: user._id }) // ProtectedRoute guarantees `user` exists here
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    setError(null);
    try {
      await orderService.updateOrderStatus(orderId, 'cancelled');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o))
      );
    } catch (err) {
      setError(err.message || 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadReceipt = async (order) => {
    try {
      await generateReceiptPDF(order);
    } catch (err) {
      setError(err.message || 'Could not generate receipt');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <PackageSearch className="mx-auto text-stone-300" size={48} />
        <h1 className="mt-4 font-serif text-2xl font-semibold text-stone-900">
          No orders yet
        </h1>
        <p className="mt-2 text-stone-500">Your order history will show up here.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-stone-900">Your Orders</h1>

      {justPlacedOrderId && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-700">
          <CheckCircle2 size={18} />
          Order placed successfully! You can track its status below.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-lg border border-stone-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <p className="text-xs text-stone-400">Order ID</p>
                <p className="text-sm font-medium text-stone-700">{order._id}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">Placed on</p>
                <p className="text-sm font-medium text-stone-700">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  STATUS_STYLES[order.orderStatus] || 'bg-stone-100 text-stone-600'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-stone-600">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between border-t border-stone-100 pt-3 text-sm font-semibold text-stone-900">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>

            {['pending', 'processing'].includes(order.orderStatus) && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  <XCircle size={16} />
                  {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}

            {order.orderStatus === 'delivered' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleDownloadReceipt(order)}
                  className="flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  <Download size={16} />
                  Download Receipt
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;