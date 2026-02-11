import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiShoppingCart, 
  FiMinus, 
  FiPlus, 
  FiHeart, 
  FiTruck, 
  FiShield, 
  FiRefreshCw,
  FiPackage,
  FiZoomIn
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdCheckCircle, MdLocalShipping } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { FaHeart, FaStar, FaRegStar } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { ReviewSkeleton } from '../../components/common/SkeletonLoader';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
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
      setIsLoading(true);
      const response = await axios.get(`/api/products/slug/${slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setIsLoading(false);
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
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
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

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
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
              <FaStar className="text-yellow-400 text-lg" />
            ) : (
              <FaRegStar className="text-gray-300 text-lg" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 5));
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
              <BiLoaderAlt className="animate-spin h-10 w-10 text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
          <div className="text-center">
            <div className="text-7xl mb-4">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Product not found</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-target"
            >
              Back to Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [null];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600 transition">Products</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
              <div className={`relative ${imageZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                   onClick={() => setImageZoom(!imageZoom)}>
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    loading="lazy"
                    className={`w-full h-[500px] object-contain p-8 transition-transform duration-500 ${
                      imageZoom ? 'scale-150' : 'group-hover:scale-110'
                    }`}
                  />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <HiSparkles className="text-8xl text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <FiZoomIn className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Click to zoom</span>
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageZoom(false);
                    }}
                    className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                      selectedImage === index 
                        ? 'ring-4 ring-purple-200 border-purple-600 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
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
                      <div className="w-full h-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <HiSparkles className="text-2xl text-gray-300" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {product.brand && (
              <div className="inline-block">
                <span className="text-sm font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-4 py-2 rounded-full">
                  {product.brand}
                </span>
              </div>
            )}

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(product.averageRating || 0))}
                  <span className="text-lg font-bold text-gray-800">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <span className="inline-block text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full capitalize">
                {product.category}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-orange-900">Only {product.stock} left in stock!</p>
                    <p className="text-sm text-orange-700">Order soon before it's gone</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Premium quality ingredients</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Dermatologically tested</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Cruelty-free & vegan</span>
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6">
                <div>
                  <label className="block font-bold text-gray-900 mb-3 text-lg">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-gray-100 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 flex items-center justify-center font-bold text-lg hover:scale-110 active:scale-95 touch-target"
                    >
                      <FiMinus className="w-5 h-5" />
                    </button>
                    <span className="text-3xl font-bold w-20 text-center text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-12 h-12 bg-gray-100 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 flex items-center justify-center font-bold text-lg hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.stock} available)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 touch-target"
                  >
                    <FiShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-16 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 touch-target ${
                      isInWishlist 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isInWishlist ? (
                      <FaHeart className="w-7 h-7" />
                    ) : (
                      <FiHeart className="w-7 h-7" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 touch-target"
                >
                  Buy Now
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-red-900 text-lg">Out of Stock</p>
                    <p className="text-sm text-red-700">This product is currently unavailable</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <MdLocalShipping className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Estimated Delivery</p>
                  <p className="text-sm text-purple-700 font-semibold">{getEstimatedDelivery()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                  <FiShield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                  <FiTruck className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                  <FiRefreshCw className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(product.averageRating || 0))}
                  <span className="text-3xl font-bold text-gray-900">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                </div>
                <span className="text-gray-600 text-lg">
                  ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-target"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-10 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Write Your Review</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Your Rating
                </label>
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm({ ...reviewForm, rating })
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="5"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all duration-300 text-gray-700"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-target"
              >
                Submit Review
              </button>
            </form>
          )}

          {loadingReviews ? (
            <div className="space-y-6">
              <ReviewSkeleton count={3} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <FaRegStar className="text-7xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-xl font-medium">No reviews yet</p>
              <p className="text-gray-500 mt-2">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                      {review.User?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{review.User?.name || 'Anonymous'}</p>
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
                      <p className="text-gray-700 leading-relaxed text-base">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {product && product.stock > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-40 animate-slideInUp">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 touch-target"
            >
              <FiShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
