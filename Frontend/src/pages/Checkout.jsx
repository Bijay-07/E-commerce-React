import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import cartService from '../api/cartService';
import orderService from '../api/orderService';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify'

const initialAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user._id; // ProtectedRoute guarantees `user` exists here

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cartService
      .getCart(userId)
      .then((res) => setCart(res.data))
      .catch(() => setCart(null))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setIsPlacingOrder(true);
    setError(null);

    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = await orderService.createOrder({
        user: userId,
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        shippingPrice: 0,
      });
      toast.success("Order Placed");
      navigate('/orders', { state: { justPlacedOrderId: order.data._id } });
    } catch (err) {
      setError(err.message || 'Could not place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-6 h-96 animate-pulse rounded-lg bg-stone-200" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-semibold text-stone-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-stone-500">Add items before checking out.</p>
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-800"
      >
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="font-serif text-3xl font-semibold text-stone-900">Checkout</h1>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Shipping form */}
        <div className="rounded-lg border border-stone-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Shipping Address
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-stone-700">Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                required
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                required
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                required
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={handleAddressChange}
                required
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                required
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          <h2 className="mt-8 font-serif text-lg font-semibold text-stone-900">
            Payment Method
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'card', label: 'Credit / Debit Card' },
              { value: 'paypal', label: 'PayPal' },
              { value: 'esewa', label: 'eSewa' },
              { value: 'khalti', label: 'Khalti' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm has-checked:border-teal-700 has-checked:bg-teal-50"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm text-stone-600">
                <span className="line-clamp-1">
                  {item.product.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-base font-semibold text-stone-900">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={isPlacingOrder}
            className="mt-6 w-full rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;