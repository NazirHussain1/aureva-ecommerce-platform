import { Link } from 'react-router-dom';
import { FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl text-white/90">Everything you need to know about delivery</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiTruck className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Shipping Options</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Standard Shipping</h3>
              <p className="text-gray-600 mb-2">Delivery in 3-5 business days</p>
              <p className="text-lg font-semibold text-purple-600">FREE on orders over $50</p>
              <p className="text-gray-600">$5.99 for orders under $50</p>
            </div>

            <div className="border-l-4 border-pink-600 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-2">Delivery in 1-2 business days</p>
              <p className="text-lg font-semibold text-pink-600">$14.99</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">International Shipping</h3>
              <p className="text-gray-600 mb-2">Delivery in 7-14 business days</p>
              <p className="text-lg font-semibold text-indigo-600">Rates vary by destination</p>
              <p className="text-gray-600">Calculated at checkout</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiClock className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Processing Time</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays 
            will be processed on the next business day.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            You'll receive a confirmation email once your order is placed, and a shipping confirmation with 
            tracking information once your order ships.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiPackage className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Order Tracking</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Once your order ships, you'll receive a tracking number via email. You can track your package by:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Clicking the tracking link in your shipping confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Logging into your account and visiting the Orders page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Contacting our customer service team</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiMapPin className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Shipping Restrictions</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            We currently ship to all 50 US states and select international destinations. Some products may 
            have shipping restrictions based on local regulations.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Unfortunately, we cannot ship to PO boxes or APO/FPO addresses at this time.
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            If you have questions about shipping or need to make changes to your order, our customer service 
            team is here to help!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
