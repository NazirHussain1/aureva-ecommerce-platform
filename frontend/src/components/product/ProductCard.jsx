import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../../features/cart/cartSlice';
import { addToWishlistAsync } from '../../features/wishlist/wishlistSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, getProductUrl } from '../../utils/helpers';
import { isLowStock, isOutOfStock } from '../../utils/productHelpers';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    if (isOutOfStock(product.stock)) {
      toast.error('This product is out of stock');
      return;
    }
    
    dispatch(addToCartAsync({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((message) => toast.error(message || 'Failed to add to cart'));
  }, [dispatch, navigate, product, user]);

  const handleAddToWishlist = useCallback((e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
    dispatch(addToWishlistAsync(product.id))
      .unwrap()
      .then(() => toast.success(`${product.name} added to wishlist!`))
      .catch((message) => toast.error(message || 'Failed to add to wishlist'));
  }, [dispatch, navigate, product, user]);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={getProductUrl(product)} className="flex-1">
        <div className="relative overflow-hidden bg-stone-50">
          <img
            src={getImageUrl(product.images?.[0]) || '/placeholder.png'}
            alt={product.name}
            className="h-64 w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
          {isLowStock(product.stock) && (
            <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock(product.stock) && (
            <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-plum-700">{product.brand || product.category}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              <FiStar className="h-3.5 w-3.5 text-amber-500" />
              {product.averageRating ? Number(product.averageRating).toFixed(1) : 'New'}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug text-stone-950 transition group-hover:text-plum-800">
            {product.name}
          </h3>
          <p className="mb-4 line-clamp-2 min-h-[3rem] text-sm leading-6 text-stone-600">{product.description}</p>
        </div>
      </Link>

      <div className="mt-auto border-t border-stone-100 p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <span className="text-2xl font-bold text-stone-950">{formatPrice(product.price)}</span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
            {product.stock} in stock
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock(product.stock)}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-plum-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-plum-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiShoppingBag className="h-4 w-4" />
            Add
          </button>
          <button
            onClick={handleAddToWishlist}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-stone-200 bg-white text-rose-700 transition hover:border-rose-200 hover:bg-rose-50"
            aria-label="Add to wishlist"
          >
            <FiHeart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
