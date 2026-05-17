import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdFavoriteBorder } from 'react-icons/md';
import AccountLayout from '../../components/common/AccountLayout';
import EmptyState from '../../components/common/EmptyState';
import { addToCartAsync } from '../../features/cart/cartSlice';
import { clearWishlist, fetchWishlist, removeFromWishlistAsync } from '../../features/wishlist/wishlistSlice';
import { getProductUrl } from '../../utils/helpers';

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-4">
        <div className="max-w-md rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
          <FiHeart className="mx-auto h-10 w-10 text-plum-900" />
          <h1 className="mt-4 text-2xl font-semibold text-stone-950">Login to view your wishlist</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Save products you love and return to them whenever you are ready.</p>
          <button type="button" onClick={() => navigate('/login')} className="btn-primary mt-6">
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlistAsync(id))
      .unwrap()
      .then(() => toast.success(`${name} removed from wishlist`))
      .catch((message) => toast.error(message || 'Failed to remove from wishlist'));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart`))
      .catch((message) => toast.error(message || 'Failed to add to cart'));
  };

  const handleClearWishlist = () => {
    if (!window.confirm('Clear your wishlist?')) return;
    dispatch(clearWishlist());
    toast.success('Wishlist cleared');
  };

  return (
    <AccountLayout
      user={user}
      title="Wishlist"
      subtitle="Saved products you may want to revisit or move to cart."
      action={items.length > 0 && (
        <button type="button" onClick={handleClearWishlist} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">
          <FiTrash2 className="h-4 w-4" />
          Clear wishlist
        </button>
      )}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={MdFavoriteBorder}
          title="Your wishlist is empty"
          message="Save products while browsing and they will appear here."
          actionText="Browse products"
          actionOnClick={() => navigate('/products')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <Link to={getProductUrl(product)} className="block aspect-square bg-stone-50">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-stone-300">
                    <HiSparkles className="h-10 w-10" />
                  </span>
                )}
              </Link>

              <div className="p-5">
                {product.brand && (
                  <p className="text-xs font-semibold uppercase tracking-normal text-rose-700">{product.brand}</p>
                )}
                <Link to={getProductUrl(product)} className="mt-2 block">
                  <h2 className="line-clamp-2 min-h-[3rem] text-base font-semibold text-stone-950 hover:text-plum-900">
                    {product.name}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-stone-600">{product.description}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xl font-semibold text-stone-950">${Number(product.price).toFixed(2)}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-ivory-100 text-plum-900' : 'bg-red-50 text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="btn-primary inline-flex flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiShoppingCart className="h-4 w-4" />
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(product.id, product.name)}
                    className="rounded-lg bg-red-50 px-4 text-red-600 transition hover:bg-red-100"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
