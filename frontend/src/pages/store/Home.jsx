import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { HiSparkles } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader';
import StoreProductCard from '../../components/product/ProductCard';
import heroImage from '../../assets/beauty-hero.png';

const CATEGORIES = [
  {
    name: 'Skincare',
    icon: HiSparkles,
    category: 'skincare',
    description: 'Cleansers, serums, moisturizers, and daily glow support.',
  },
  {
    name: 'Haircare',
    icon: GiComb,
    category: 'haircare',
    description: 'Salon-inspired care for shine, strength, and softness.',
  },
  {
    name: 'Makeup',
    icon: GiLipstick,
    category: 'makeup',
    description: 'Everyday color, complexion essentials, and finishing touches.',
  },
  {
    name: 'Fragrance',
    icon: GiPerfumeBottle,
    category: 'fragrance',
    description: 'Signature scents for daytime polish and evening depth.',
  },
  {
    name: "Men's Care",
    icon: IoManSharp,
    category: 'men',
    description: 'Simple grooming, skin, and personal care routines.',
  },
  {
    name: "Women's Care",
    icon: IoWomanSharp,
    category: 'women',
    description: 'Curated care for daily rituals and special moments.',
  },
  {
    name: "Kids' Care",
    icon: MdChildCare,
    category: 'kids',
    description: 'Gentle essentials selected for delicate everyday care.',
  },
  {
    name: 'Wellness',
    icon: MdFace,
    category: 'wellness',
    description: 'Personal wellness products that complete the routine.',
  }
];

const CategoryCard = memo(({ cat }) => {
  const IconComponent = cat.icon;
  return (
    <Link
      key={cat.category}
      to={`/products?category=${cat.category}`}
      className="group flex min-h-[190px] flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
    >
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-plum-800 transition group-hover:bg-plum-800 group-hover:text-white">
          <IconComponent className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-stone-950">
          {cat.name}
        </h3>
        <p className="text-sm leading-6 text-stone-600">{cat.description}</p>
      </div>
      <span className="mt-5 inline-flex items-center text-sm font-semibold text-plum-800">
        Browse category
        <svg className="ml-2 h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
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
      
      <div className="bg-ivory px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">Shop by ritual</p>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
                Find the products that fit your routine.
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="text-base leading-7 text-stone-600">
                Browse focused collections for skin, hair, makeup, fragrance, and daily care. Each category is organized to help customers move from discovery to checkout faster.
              </p>
              <Link
                to="/products"
                className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
              >
                View all products
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-stone-200 py-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">The Aureva edit</p>
              <h2 className="max-w-xl text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
                New launches, restocks, and care notes worth opening.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                A calm newsletter for beauty shoppers: useful product updates, practical routine ideas, and private offers when they matter.
              </p>
            </div>

            <div className="rounded-2xl bg-ivory p-5 sm:p-6 lg:p-8">
              <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <FiMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="min-h-14 w-full rounded-xl border border-stone-200 bg-white py-4 pl-12 pr-4 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="inline-flex min-h-14 items-center justify-center rounded-xl bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-plum-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {subscribing ? (
                      <span className="flex items-center gap-2">
                        <BiLoaderAlt className="h-5 w-5 animate-spin" />
                        Joining
                      </span>
                    ) : (
                      'Join list'
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                  <p>No spam. Unsubscribe anytime.</p>
                  <div className="flex flex-wrap gap-2">
                    {['New drops', 'Restocks', 'Offers'].map((item) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum-800">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default memo(Home);
