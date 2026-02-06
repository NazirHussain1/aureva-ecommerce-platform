import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import ProductGrid from '../../components/product/ProductGrid';

export default function ProductList() {
  const dispatch = useDispatch();
  const { items: products, isLoading } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || ''
  });

  const categories = ['skincare', 'haircare', 'makeup', 'fragrance', 'personal wellness', 'beauty accessories'];

  // Fetch products whenever filters change (with debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchProducts(filters));
    }, 400); // 400ms debounce
    return () => clearTimeout(delay);
  }, [filters, dispatch]);

  // Update URL query params based on filters
  const updateURL = (newFilters) => {
    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params[key] = newFilters[key];
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const reset = { category: '', minPrice: '', maxPrice: '', search: '' };
    setFilters(reset);
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Shop Products</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-pink-600">Clear</button>
              </div>

              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <div className="mb-5 text-gray-600 text-sm">
              {isLoading ? 'Loading products...' : `${products.length} results found`}
            </div>
            <ProductGrid products={products} isLoading={isLoading} />
          </main>
        </div>
      </div>
    </div>
  );
}
