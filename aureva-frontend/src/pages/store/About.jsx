import { Link } from 'react-router-dom';
import { FiAward, FiHeart, FiShield, FiTruck } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdEco } from 'react-icons/md';
import Footer from '../../components/common/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <HiSparkles className="text-6xl mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">About Aureva Beauty</h1>
          <p className="text-xl text-pink-100">
            Discover Your Natural Radiance with Premium Beauty Products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2024, Aureva Beauty was born from a passion for helping people discover their natural beauty. We believe that everyone deserves access to high-quality, effective beauty products that make them feel confident and radiant.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our carefully curated collection features premium skincare, makeup, haircare, and wellness products from trusted brands around the world. Each product is selected with care to ensure it meets our high standards for quality, effectiveness, and safety.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At Aureva Beauty, we're more than just an e-commerce store – we're your partner in your beauty journey, committed to helping you look and feel your absolute best.
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <HiSparkles className="text-9xl text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Why Choose Aureva?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest products from trusted brands worldwide
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">100% Authentic</h3>
              <p className="text-gray-600">
                Guaranteed genuine products with authenticity certificates
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to your doorstep
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdEco className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                Committed to sustainable and cruelty-free products
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-12 text-center text-white mb-20">
          <FiHeart className="text-6xl mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
            To empower individuals to embrace their unique beauty by providing access to premium, effective, and sustainable beauty products that enhance confidence and promote self-care.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Start Your Beauty Journey?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Explore our curated collection of premium beauty products
          </p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
