import { Link } from 'react-router';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItemRow = ({ item, onUpdateQuantity, onRemove, isUpdating }) => {
  const { product, quantity, price } = item;
  const image = product?.images?.[0] || 'https://placehold.co/200x200?text=No+Image';

  return (
    <div className="flex items-center gap-4 border-b border-stone-200 py-4 last:border-b-0">
      <Link to={`/products/${product?._id}`} className="shrink-0">
        <img
          src={image}
          alt={product?.name}
          className="h-20 w-20 rounded-md object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/products/${product?._id}`}
          className="line-clamp-1 text-sm font-medium text-stone-900 hover:text-teal-700"
        >
          {product?.name || 'Product'}
        </Link>
        <p className="mt-1 text-sm text-stone-500">${price.toFixed(2)} each</p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-md border border-stone-300">
            <button
              onClick={() => onUpdateQuantity(product._id, Math.max(1, quantity - 1))}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(product._id, quantity + 1)}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => onRemove(product._id)}
            disabled={isUpdating}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600 disabled:opacity-40"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 text-sm font-semibold text-stone-900">
        ${(price * quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItemRow;