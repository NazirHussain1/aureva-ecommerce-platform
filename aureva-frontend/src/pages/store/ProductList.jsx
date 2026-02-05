import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilter from '../../components/product/ProductFilter';

export default function ProductList() {
  const dispatch = useDispatch();
  const { items: products, isLoading } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter filters={filters} onFilterChange={setFilters} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
