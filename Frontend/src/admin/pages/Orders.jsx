import { useEffect, useState } from 'react';
import { Eye, X, Trash2 } from 'lucide-react';
import orderService from '../../api/orderService';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Defines the "next step" button shown for each status, per your Order model's enum
const NEXT_STATUS = {
  pending: { label: 'Approve', next: 'processing' },
  processing: { label: 'Mark Shipped', next: 'shipped' },
  shipped: { label: 'Mark Delivered', next: 'delivered' },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const loadOrders = () => {
    setIsLoading(true);
    orderService
      .getOrders() // no ?user= filter — admin sees every order
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError(null);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      setError(err.message || 'Could not update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Permanently delete this order? This cannot be undone.')) return;
    setUpdatingId(orderId);
    setError(null);
    try {
      await orderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      setError(err.message || 'Could not delete order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-stone-900">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">Review and manage customer orders.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-stone-400">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-stone-400">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const nextStep = NEXT_STATUS[order.orderStatus];
                const canCancel = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

                return (
                  <tr key={order._id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{order.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-stone-400">{order.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          STATUS_STYLES[order.orderStatus] || 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="text-stone-500 hover:text-teal-700"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>

                        {nextStep && (
                          <button
                            onClick={() => handleStatusChange(order._id, nextStep.next)}
                            disabled={updatingId === order._id}
                            className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
                          >
                            {nextStep.label}
                          </button>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => handleStatusChange(order._id, 'cancelled')}
                            disabled={updatingId === order._id}
                            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}

                        {order.orderStatus === 'cancelled' && (
                          <button
                            onClick={() => handleDelete(order._id)}
                            disabled={updatingId === order._id}
                            className="flex items-center gap-1 text-stone-400 hover:text-red-600 disabled:opacity-50"
                            title="Delete order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order detail modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-serif text-lg font-semibold text-stone-900">Order Details</h2>
              <button onClick={() => setViewingOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-sm">
              <div>
                <p className="text-xs text-stone-400">Customer</p>
                <p className="font-medium text-stone-900">
                  {viewingOrder.user?.name} ({viewingOrder.user?.email})
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-400">Shipping Address</p>
                <p className="text-stone-700">
                  {viewingOrder.shippingAddress?.street}, {viewingOrder.shippingAddress?.city},{' '}
                  {viewingOrder.shippingAddress?.state} {viewingOrder.shippingAddress?.zipCode},{' '}
                  {viewingOrder.shippingAddress?.country}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-400">Payment Method</p>
                <p className="capitalize text-stone-700">{viewingOrder.paymentMethod}</p>
              </div>

              <div>
                <p className="mb-1 text-xs text-stone-400">Items</p>
                <div className="space-y-1 rounded-md border border-stone-100 p-3">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-stone-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t border-stone-100 pt-3 font-semibold text-stone-900">
                <span>Total</span>
                <span>${viewingOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;