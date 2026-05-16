import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { HiSparkles } from 'react-icons/hi';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader';
import StoreProductCard from '../../components/product/ProductCard';
import heroImage from '../../assets/beauty-hero.png';

// Memoized category data to prevent recreation on every render
const CATEGORIES = [
  { name: 'Skincare', icon: HiSparkles, category: 'skincare', gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
  { name: 'Haircare', icon: GiComb, category: 'haircare', gradient: 'from-pink-400 to-pink-600', bg: 'bg-pink-50' },
  { name: 'Makeup', icon: GiLipstick, category: 'makeup', gradient: 'from-red-400 to-red-600', bg: 'bg-red-50' },
  { name: 'Fragrance', icon: GiPerfumeBottle, category: 'fragrance', gradient: 'from-indigo-400 to-indigo-600', bg: 'bg-indigo-50' },
  { name: "Men's Care", icon: IoManSharp, category: 'men', gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
  { name: "Women's Care", icon: IoWomanSharp, category: 'women', gradient: 'from-pink-500 to-pink-700', bg: 'bg-pink-50' },
  { name: "Kids' Care", icon: MdChildCare, category: 'kids', gradient: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
  { name: 'Wellness', icon: MdFace, category: 'wellness', gradient: 'from-green-400 to-green-600', bg: 'bg-green-50' }
];

// Memoized CategoryCard component
const CategoryCard = memo(({ cat }) => {
  const IconComponent = cat.icon;
  return (
    <Link
      key={cat.category}
      to={`/products?category=${cat.category}`}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-6 sm:p-8 flex flex-col items-center">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${cat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <IconComponent className={`text-3xl sm:text-4xl bg-gradient-to-br ${cat.gradient} bg-clip-text text-transparent`} />
        </div>
        
        <h3 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 text-center">
          {cat.name}
        </h3>
        
        <div className="mt-3 flex items-center gap-1 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Explore</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
});

CategoryCard.displayName = 'CategoryCard';

function Home() {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products');
      const allProducts = response.data.products || [];
      setProducts(allProducts.filter(p => p.stock > 0).slice(0, 8));
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNewsletterSubscribe = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setSubscribing(true);
      await axios.post('/newsletter/subscribe', { email: newsletterEmail });
      toast.success('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
      
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  }, [newsletterEmail]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative mt-20 overflow-hidden bg-ivory">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/92 to-ivory/20"></div>
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-t from-ivory via-transparent to-transparent"></div>
        </div>

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-semibold text-plum-800 shadow-sm backdrop-blur">
              <HiSparkles className="h-4 w-4 text-rose-600" />
              Curated beauty essentials
            </div>

            <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-6xl lg:text-7xl">
              Beauty that feels considered, not complicated.
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-stone-700 sm:text-xl">
              Shop refined skincare, makeup, fragrance, and daily care picks selected for quality, comfort, and everyday confidence.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-plum-800 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-plum-900"
              >
                Shop Collection
              </Link>
              <Link
                to="/products?category=skincare"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-stone-300 bg-white/85 px-7 py-3.5 text-base font-semibold text-stone-800 shadow-sm backdrop-blur transition hover:border-rose-300 hover:bg-white"
              >
                Explore Skincare
              </Link>
            </div>

            <div className="mt-10 grid gap-4 border-t border-stone-200 pt-8 sm:grid-cols-3">
              {[
                ['Free delivery', 'On qualifying orders'],
                ['Cash on delivery', 'Pakistan-friendly checkout'],
                ['10-day returns', 'Clear support policy'],
              ].map(([title, copy]) => (
                <div key={title}>
                  <p className="text-sm font-semibold text-stone-950">{title}</p>
                  <p className="text-sm leading-6 text-stone-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our curated collections for every beauty need</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map(cat => (
              <CategoryCard key={cat.category} cat={cat} />
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HiSparkles className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our best-selling beauty essentials</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <ProductCardSkeleton count={8} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <div className="text-7xl mb-4">📦</div>
              <p className="text-gray-600 text-xl mb-2">No products available yet</p>
              <p className="text-gray-500 mb-6">Check back soon for amazing beauty products</p>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/products" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Products
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {products.map(product => (
                  <StoreProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 touch-target"
                >
                  <span>View All Products</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <HiSparkles className="w-4 h-4" />
            <span>Stay Updated</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Subscribe to Newsletter</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Get exclusive offers, beauty tips, and early access to new products delivered to your inbox
          </p>
          
          <form onSubmit={handleNewsletterSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-white/30 transition shadow-lg placeholder:text-gray-400" 
                required
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap touch-target"
              >
                {subscribing ? (
                  <span className="flex items-center gap-2">
                    <BiLoaderAlt className="animate-spin w-5 h-5" />
                    Subscribing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Subscribe Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-sm text-purple-100 mt-4">
              Join 10,000+ beauty enthusiasts. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default memo(Home);
