import { Link } from 'react-router-dom';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-white/90">Your satisfaction is our priority</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiRefreshCw className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Our Return Policy</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            We want you to love your purchase! If you're not completely satisfied, we offer a hassle-free 
            return policy to ensure your shopping experience is worry-free.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-purple-800 font-semibold">
              30-day return window for unopened products | 14-day return window for opened products
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Return Eligibility</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-3">
                <FiCheckCircle className="text-2xl text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Eligible for Return</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Unopened products in original packaging within 30 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Opened products within 14 days if unsatisfied</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Defective or damaged products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Wrong items received</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <FiXCircle className="text-2xl text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Not Eligible for Return</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Opened makeup products (lipsticks, mascaras, etc.) unless defective</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Used makeup brushes or applicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Intimate care products that have been opened</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Products without original packaging or tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Sale or clearance items marked as final sale</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Return an Item</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Log into Your Account</h3>
                <p className="text-gray-600">
                  Sign in to your Aureva Beauty account and navigate to the Orders page.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Select Your Order</h3>
                <p className="text-gray-600">
                  Find the order containing the item you want to return and click "Request Return".
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Choose Return Reason</h3>
                <p className="text-gray-600">
                  Select the reason for your return and provide any additional details.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Print Return Label</h3>
                <p className="text-gray-600">
                  Download and print your prepaid return shipping label.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Ship Your Return</h3>
                <p className="text-gray-600">
                  Pack the item securely, attach the label, and drop it off at any authorized shipping location.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Refund Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-xl text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Processing Time</h3>
                <p className="text-gray-600">
                  Refunds are processed within 5-7 business days after we receive and inspect your return.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-xl text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Refund Method</h3>
                <p className="text-gray-600">
                  Refunds will be credited to your original payment method. Please allow 3-5 business days 
                  for the refund to appear in your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-xl text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Shipping Costs</h3>
                <p className="text-gray-600">
                  Original shipping costs are non-refundable unless the return is due to our error or a 
                  defective product.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Exchanges</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            We currently don't offer direct exchanges. If you'd like a different product, please return 
            the original item for a refund and place a new order for the item you want.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            This ensures you get your preferred product as quickly as possible without waiting for the 
            return to be processed first.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Damaged or Defective Items</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            If you receive a damaged or defective product, please contact us immediately at{' '}
            <a href="mailto:support@aureva.com" className="text-purple-600 hover:underline font-semibold">
              support@aureva.com
            </a>{' '}
            with photos of the damage.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We'll arrange for a replacement or full refund, including shipping costs, at no charge to you.
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
          <p className="mb-6">
            Our customer service team is here to assist you with any questions or concerns about returns.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Support
            </Link>
            <Link
              to="/orders"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
