import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../features/products/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiHeart } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import Footer from '../../components/common/Footer';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const isInWishlist = product && wishlistItems.some(item => item.id === product.id);

  useEffect(() => {
    fetchProductBySlug();
    fetchReviews();
  }, [slug]);

  const fetchProductBySlug = async () => {
    try {
      const response = await axios.get(`/api/products/slug/${slug}`);
      dispatch({ type: 'products/setCurrentProduct', payload: response.data });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(`/api/products/slug/${slug}/reviews`);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Aureva Beauty`;
    }
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    dispatch(addToCart({ product, quantity }));
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await axios.post(`/api/products/${product.id}/reviews`, reviewForm);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchProductBySlug();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}
            disabled={!interactive}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BiLoaderAlt className="inline-block animate-spin h-16 w-16 text-purple-600" />
          <p className="text-gray-600 mt-4 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [null];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Aureva Beauty
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <FiShoppingCart className="w-6 h-6 text-gray-700" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => navigate('/products')}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="bg-white rounded-xl overflow-hidden mb-4 border border-gray-200">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-96 object-contain p-6"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <HiSparkles className="text-6xl text-gray-400" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-white rounded-lg overflow-hidden transition border ${
                        selectedImage === index ? 'ring-2 ring-purple-600 border-purple-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          loading="lazy"
                          className="w-full h-20 object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-20 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <HiSparkles className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {product.brand && (
                <p className="text-sm text-purple-600 font-semibold uppercase mb-2">
                  {product.brand}
                </p>
              )}
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-6 capitalize inline-block bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </p>

              <div className="flex items-center mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Availability</h3>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <MdCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} units available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MdCancel className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {product.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block font-semibold text-gray-800 mb-3">Quantity</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                      >
                        <FiMinus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl hover:from-pink-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`w-14 h-14 rounded-xl transition flex items-center justify-center shadow-lg ${
                        isInWishlist 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isInWishlist ? (
                        <FaHeart className="w-6 h-6" />
                      ) : (
                        <FiHeart className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {product && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {renderStars(Math.round(product.averageRating || 0))}
                    <span className="text-2xl font-bold text-gray-800">
                      {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              
              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold shadow-md"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Write Your Review</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  {renderStars(reviewForm.rating, true, (rating) => 
                    setReviewForm({ ...reviewForm, rating })
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold shadow-md"
                >
                  Submit Review
                </button>
              </form>
            )}

            {loadingReviews ? (
              <div className="text-center py-8">
                <BiLoaderAlt className="inline-block animate-spin h-8 w-8 text-purple-600" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <FaRegStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.User?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{review.User?.name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
