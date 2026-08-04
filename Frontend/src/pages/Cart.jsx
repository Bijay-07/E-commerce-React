import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import cartService from '../api/cartService';
import CartItemRow from '../components/CartItemRow';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const userId = user._id; // ProtectedRoute guarantees `user` exists here

  const loadCart = () => {
    setIsLoading(true);
    cartService
      .getCart(userId)
      .then((res) => setCart(res.data))
      .catch(() => setCart(null)) // 404 just means empty cart
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    setIsUpdating(true);
    setError(null);
    try {
      // Note: updateItem's response isn't populated (product is a raw ID),
      // so we re-fetch via getCart to get item.product back as a full object.
      await cartService.updateItem(userId, productId, quantity);
      const res = await cartService.getCart(userId);
      setCart(res.data);
    } catch (err) {
      setError(err.message || 'Could not update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (productId) => {
    setIsUpdating(true);
    setError(null);
    try {
      await cartService.removeItem(userId, productId);
      toast.success("Removed From Cart")
      const res = await cartService.getCart(userId);
      setCart(res.data);
    } catch (err) {
      setError(err.message || 'Could not remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const res = await cartService.clearCart(userId);
      setCart(res.data);
    } catch (err) {
      setError(err.message || 'Could not clear cart');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto text-stone-300" size={48} />
        <h1 className="mt-4 font-serif text-2xl font-semibold text-stone-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-stone-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-stone-900">Your Cart</h1>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="rounded-lg border border-stone-200 bg-white p-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={item.product._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              isUpdating={isUpdating}
            />
          ))}

          <button
            onClick={handleClearCart}
            disabled={isUpdating}
            className="mt-4 text-sm text-stone-500 hover:text-red-600 disabled:opacity-40"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-xs text-stone-400">Shipping calculated at checkout</p>

          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-base font-semibold text-stone-900">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={isUpdating}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;