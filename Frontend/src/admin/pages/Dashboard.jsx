import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Package, Users, Clock } from 'lucide-react';
import orderService from '../../api/orderService';
import productService from '../../api/productService';
import userService from '../../api/userService';

const STATUS_COLORS = {
  pending: 'bg-amber-500',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-teal-600',
  cancelled: 'bg-red-500',
};

const StatCard = ({ icon: Icon, label, value, tone = 'text-stone-900' }) => (
  <div className="rounded-lg border border-stone-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{label}</p>
        <p className={`text-xl font-semibold ${tone}`}>{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([orderService.getOrders(), productService.getProducts(), userService.getUsers()])
      .then(([orderRes, productRes, userRes]) => {
        setOrders(orderRes.data);
        setProductCount(productRes.count ?? productRes.data.length);
        setCustomerCount(userRes.data.filter((u) => u.role !== 'admin').length);
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard data'))
      .finally(() => setIsLoading(false));
  }, []);

  // Revenue is counted from delivered orders only — actual profit isn't
  // tracked yet since the Product model has no cost-price field.
  const revenue = orders
    .filter((o) => o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending').length;

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">An overview of your store's activity.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Revenue (Delivered)" value={`$${revenue.toFixed(2)}`} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingCount}
          tone={pendingCount > 0 ? 'text-amber-600' : 'text-stone-900'}
        />
        <StatCard icon={Package} label="Products" value={productCount} />
        <StatCard icon={Users} label="Customers" value={customerCount} />
      </div>

      {/* Order status breakdown */}
      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-stone-900">Orders by Status</h2>

        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-stone-400">No orders yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {Object.entries(STATUS_COLORS).map(([status, colorClass]) => {
              const count = statusCounts[status] || 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm capitalize text-stone-600">{status}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-medium text-stone-700">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;