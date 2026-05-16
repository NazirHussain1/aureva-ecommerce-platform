import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiSearch, FiSliders } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { GiLipstick, GiPerfumeBottle, GiComb } from 'react-icons/gi';
import { MdFace, MdChildCare } from 'react-icons/md';
import { IoManSharp, IoWomanSharp } from 'react-icons/io5';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/common/SkeletonLoader';

const categories = [
  { value: '', label: 'All Products', icon: FiSliders },
  { value: 'skincare', label: 'Skincare', icon: HiSparkles },
  { value: 'haircare', label: 'Haircare', icon: GiComb },
  { value: 'makeup', label: 'Makeup', icon: GiLipstick },
  { value: 'fragrance', label: 'Fragrance', icon: GiPerfumeBottle },
  { value: 'men', label: "Men's Care", icon: IoManSharp },
  { value: 'women', label: "Women's Care", icon: IoWomanSharp },
  { value: 'kids', label: "Kids' Care", icon: MdChildCare },
  { value: 'wellness', label: 'Wellness', icon: MdFace },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Products - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products');
        setProducts(response.data.products || []);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateFilters = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !normalizedSearch
        || product.name?.toLowerCase().includes(normalizedSearch)
        || product.description?.toLowerCase().includes(normalizedSearch)
        || product.brand?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch && product.stock > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 mt-20">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">Shop Aureva</p>
            <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">Beauty essentials</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Refined skincare, makeup, fragrance, and daily care products selected for everyday routines.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                updateFilters({ search: event.target.value });
              }}
              className="w-full rounded-lg border border-stone-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-stone-800 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const selected = selectedCategory === category.value;
            return (
              <button
                key={category.value || 'all'}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.value);
                  updateFilters({ category: category.value });
                }}
                className={`inline-flex min-h-11 flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? 'border-plum-800 bg-plum-800 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-rose-200 hover:bg-rose-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductCardSkeleton count={12} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
            <FiSearch className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <h3 className="mb-2 text-2xl font-semibold text-stone-950">No products found</h3>
            <p className="text-stone-600">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
