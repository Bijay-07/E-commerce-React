import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import productService from '../api/productService';
import cartService from '../api/cartService';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setQuantity(1);
    setActiveImage(0);

    productService
      .getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message || 'Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    setIsAdding(true);
    setFeedback(null);

    try {
      await cartService.addItem(user._id, product._id, quantity);
      toast.success("Added to Cart");
    } catch (err) {
      setFeedback({ type: 'error', message: err.message});
      toast("Couldn't Added to Cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-lg bg-stone-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-stone-200" />
            <div className="h-5 w-1/4 rounded bg-stone-200" />
            <div className="h-24 w-full rounded bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-stone-600">{error || 'Product not found.'}</p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const { name, description, price, discountPrice, images, stock, brand, category, ratings, numReviews } = product;
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const gallery = images && images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image'];
  const isOutOfStock = stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-800"
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            <img
              src={gallery[activeImage]}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                    activeImage === i ? 'border-teal-700' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {category?.name && (
            <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
              {category.name}
            </span>
          )}
          <h1 className="mt-1 font-serif text-3xl font-semibold text-stone-900">{name}</h1>

          {brand && <p className="mt-1 text-sm text-stone-500">by {brand}</p>}

          {numReviews > 0 && (
            <p className="mt-2 text-sm text-stone-500">
              ★ {ratings.toFixed(1)} ({numReviews} review{numReviews !== 1 ? 's' : ''})
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-semibold text-teal-700">
                  ${discountPrice.toFixed(2)}
                </span>
                <span className="text-lg text-stone-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-stone-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm">
            {isOutOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : (
              <span className="text-stone-500">{stock} in stock</span>
            )}
          </p>

          {description && (
            <p className="mt-5 leading-relaxed text-stone-600">{description}</p>
          )}

          {/* Quantity selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-stone-700">Quantity</span>
            <div className="flex items-center rounded-md border border-stone-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock}
                className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={isOutOfStock}
                className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
          >
            <ShoppingCart size={18} />
            {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {feedback && (
            <p
              className={`mt-3 text-sm ${
                feedback.type === 'success' ? 'text-teal-700' : 'text-red-600'
              }`}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;