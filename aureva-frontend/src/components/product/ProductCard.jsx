import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist } from '../../features/wishlist/wishlistSlice';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';
import { isLowStock, isOutOfStock } from '../../utils/productHelpers';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isOutOfStock(product.stock)) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    dispatch(addToWishlist(product));
  };

  return (
    <div className="card group overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition relative flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-1">
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(product.images?.[0]) || '/placeholder.png'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isLowStock(product.stock) && (
            <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock(product.stock) && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1 capitalize">{product.category}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        </div>
      </Link>

      <div className="p-4 flex items-center justify-between border-t border-gray-200">
        <span className="text-2xl font-bold text-pink-600">{formatPrice(product.price)}</span>
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock(product.stock)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="bg-white border border-gray-300 hover:bg-pink-50 text-pink-600 px-3 py-2 rounded-lg transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
