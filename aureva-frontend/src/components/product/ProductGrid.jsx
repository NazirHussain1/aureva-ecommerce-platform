import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist } from '../../features/wishlist/wishlistSlice';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, getProductUrl } from '../../utils/helpers';

export default function ProductGrid({ products = [], isLoading = false }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    dispatch(addToWishlist(product));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card p-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          to={getProductUrl(product)}
          key={product.id}
          className="card overflow-hidden group bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <div className="relative h-64 bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-20 h-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Stock Badges */}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Low Stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => handleAddToWishlist(e, product)}
              className="absolute top-2 left-2 bg-white p-2 rounded-full shadow hover:bg-pink-50 transition"
            >
              <svg
                className="w-5 h-5 text-pink-600"
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

          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1 capitalize">{product.category}</p>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-pink-600">
                {formatPrice(product.price)}
              </span>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stock === 0}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
