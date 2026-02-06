import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts({ limit: 8 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Aureva Beauty</h1>
          <p className="text-xl mb-8">Discover Your Natural Radiance</p>
          <Link
            to="/products"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Wellness', 'Accessories'].map((cat) => (
              <div key={cat} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-2">✨</div>
                <h3 className="font-semibold text-gray-800">{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-600">Products will appear here once added by admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-5xl">🧴</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-purple-600 font-bold text-xl">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Easy Returns</h3>
              <p className="text-gray-600">10-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-8">Get exclusive offers and beauty tips</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
