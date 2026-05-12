import { Link } from 'react-router-dom';
import { FiFileText, FiShield, FiAlertCircle } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/90">Last updated: February 10, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiFileText className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Agreement to Terms</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Welcome to Aureva Beauty. By accessing or using our website and services, you agree to be bound by these Terms of Service. 
            Please read them carefully before using our platform.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-purple-800 font-semibold">
              If you do not agree to these terms, please do not use our services.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Use of Our Services</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              <strong className="text-gray-800">Eligibility:</strong> You must be at least 18 years old to use our services. 
              By using Aureva Beauty, you represent that you meet this age requirement.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Account Registration:</strong> You are responsible for maintaining the 
              confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Prohibited Activities:</strong> You agree not to engage in any activity that 
              interferes with or disrupts our services, including but not limited to hacking, data mining, or transmitting viruses.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Products and Orders</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              <strong className="text-gray-800">Product Information:</strong> We strive to provide accurate product descriptions 
              and images. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Pricing:</strong> All prices are in USD and are subject to change without notice. 
              We reserve the right to correct any pricing errors.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Order Acceptance:</strong> We reserve the right to refuse or cancel any order 
              for any reason, including product availability, errors in pricing, or suspected fraud.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Payment:</strong> By providing payment information, you represent that you are 
              authorized to use the payment method and authorize us to charge the total amount.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">3. Intellectual Property</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              All content on Aureva Beauty, including text, graphics, logos, images, and software, is the property of 
              Aureva Beauty or its content suppliers and is protected by intellectual property laws.
            </p>
            <p className="leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative works from any content without our express 
              written permission.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">4. User Content</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              <strong className="text-gray-800">Reviews and Comments:</strong> You may post reviews and comments on our 
              platform. By doing so, you grant us a non-exclusive, royalty-free license to use, reproduce, and display 
              your content.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Content Standards:</strong> You agree not to post content that is unlawful, 
              defamatory, obscene, or infringes on the rights of others.
            </p>
            <p className="leading-relaxed">
              <strong className="text-gray-800">Moderation:</strong> We reserve the right to remove any content that violates 
              these terms or is otherwise objectionable.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">5. Limitation of Liability</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              To the fullest extent permitted by law, Aureva Beauty shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of our services.
            </p>
            <p className="leading-relaxed">
              Our total liability for any claim arising from your use of our services shall not exceed the amount you 
              paid for the product or service in question.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">6. Shipping and Delivery</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers 
              or customs.
            </p>
            <p className="leading-relaxed">
              Risk of loss and title for products pass to you upon delivery to the carrier.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">7. Returns and Refunds</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Our return and refund policy is detailed on our{' '}
              <Link to="/returns" className="text-purple-600 hover:underline font-semibold">
                Returns & Exchanges
              </Link>{' '}
              page. Please review it carefully before making a purchase.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">8. Privacy</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link to="/privacy" className="text-purple-600 hover:underline font-semibold">
                Privacy Policy
              </Link>{' '}
              to understand how we collect, use, and protect your personal information.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">9. Modifications to Terms</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
              upon posting. Your continued use of our services after changes are posted constitutes acceptance of the 
              modified terms.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">10. Governing Law</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              These Terms of Service are governed by the laws of the United States. Any disputes shall be resolved in 
              the courts of New York, NY.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">11. Contact Information</h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex items-start gap-3 mt-4">
              <FiAlertCircle className="text-xl text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Email:</p>
                <a href="mailto:legal@aureva.com" className="text-purple-600 hover:underline">
                  legal@aureva.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiShield className="text-3xl" />
            <h2 className="text-2xl font-bold">Your Trust Matters</h2>
          </div>
          <p className="mb-6">
            We're committed to providing a safe and transparent shopping experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/privacy"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
