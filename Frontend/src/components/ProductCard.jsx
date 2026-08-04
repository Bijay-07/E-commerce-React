import { Link } from 'react-router';

const ProductCard = ({ product }) => {
  const { _id, name, price, discountPrice, images, stock } = product;
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const displayImage = images?.[0] || 'https://placehold.co/400x400?text=No+Image';

  return (
    <Link
      to={`/products/${_id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-stone-900">{name}</h3>
        <div className="mt-auto flex items-center gap-2 pt-2">
          {hasDiscount ? (
            <>
              <span className="text-base font-semibold text-teal-700">
                ${discountPrice.toFixed(2)}
              </span>
              <span className="text-sm text-stone-400 line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-stone-900">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
        {stock === 0 && (
          <span className="mt-1 text-xs font-medium text-red-600">Out of stock</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;