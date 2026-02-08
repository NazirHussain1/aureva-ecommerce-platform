import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';
import { FiAward, FiHeart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Our Story</h1>
          <p className="text-xl text-white/90">Discover the journey behind Aureva Beauty</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <HiSparkles className="text-5xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Founded in 2020, Aureva Beauty was born from a simple belief: everyone deserves access to premium, 
            effective beauty products that enhance their natural radiance. We're more than just an e-commerce 
            platform – we're a community dedicated to helping you discover your most confident self.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our carefully curated collection features the finest skincare, makeup, haircare, and wellness products 
            from around the world. Each product is selected with care, ensuring it meets our high standards for 
            quality, effectiveness, and sustainability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
            <p className="text-gray-600">Premium Products</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">50K+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">4+ Years</h3>
            <p className="text-gray-600">In Business</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            At Aureva Beauty, our mission is to empower individuals to feel confident and beautiful in their own skin. 
            We believe that beauty is personal, and everyone's journey is unique. That's why we offer a diverse range 
            of products to suit every skin type, concern, and preference.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We're committed to transparency, sustainability, and ethical practices. From sourcing ingredients to 
            packaging, we consider the impact of every decision on both our customers and the planet.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product in our collection is thoroughly vetted and tested.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">Customer-Centric</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to support you every step of your beauty journey.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to eco-friendly practices and partnering with brands that share our values.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of beauty trends, bringing you the latest and most effective products.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
