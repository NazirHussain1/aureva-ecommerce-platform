import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiEye, FiDatabase } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/90">Last updated: February 10, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiShield className="text-4xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Your Privacy Matters</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            At Aureva Beauty, we are committed to protecting your privacy and ensuring the security of your personal 
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website or make a purchase.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <p className="text-purple-800 font-semibold">
              By using our services, you consent to the data practices described in this policy.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiDatabase className="text-3xl text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Personal Information</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Name, email address, phone number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Shipping and billing addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Payment information (processed securely through third-party providers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Account credentials (username and password)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Order history and preferences</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>IP address and browser type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Device information and operating system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Pages visited and time spent on our site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Referring website and search terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiEye className="text-3xl text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            We use the information we collect for various purposes:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Process Orders:</strong> To fulfill your purchases, process payments, and arrange shipping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Customer Service:</strong> To respond to your inquiries and provide support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Marketing:</strong> To send promotional emails about new products and special offers (you can opt-out anytime)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Improve Services:</strong> To analyze usage patterns and enhance our website and products</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Security:</strong> To detect and prevent fraud and unauthorized access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span><strong className="text-gray-800">Legal Compliance:</strong> To comply with applicable laws and regulations</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiLock className="text-3xl text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">3. Information Sharing</h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-800 mb-1">Service Providers</h3>
              <p className="text-gray-600">
                Third-party companies that help us operate our business (payment processors, shipping companies, email services)
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-800 mb-1">Legal Requirements</h3>
              <p className="text-gray-600">
                When required by law or to protect our rights and safety
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-800 mb-1">Business Transfers</h3>
              <p className="text-gray-600">
                In connection with a merger, acquisition, or sale of assets
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">4. Cookies and Tracking</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your browsing experience:
          </p>
          <ul className="space-y-2 text-gray-600 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong className="text-gray-800">Essential Cookies:</strong> Required for website functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong className="text-gray-800">Analytics Cookies:</strong> Help us understand how visitors use our site</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong className="text-gray-800">Marketing Cookies:</strong> Used to deliver relevant advertisements</span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            You can control cookies through your browser settings, but disabling them may affect website functionality.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="space-y-2 text-gray-600 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>SSL encryption for data transmission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Secure payment processing through trusted providers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Limited employee access to personal data</span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">6. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">→</span>
              <span><strong className="text-gray-800">Access:</strong> Request a copy of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">→</span>
              <span><strong className="text-gray-800">Correction:</strong> Update or correct inaccurate information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">→</span>
              <span><strong className="text-gray-800">Deletion:</strong> Request deletion of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">→</span>
              <span><strong className="text-gray-800">Opt-Out:</strong> Unsubscribe from marketing communications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">→</span>
              <span><strong className="text-gray-800">Portability:</strong> Receive your data in a portable format</span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:privacy@aureva.com" className="text-purple-600 hover:underline font-semibold">
              privacy@aureva.com
            </a>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">7. Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our services are not intended for children under 18. We do not knowingly collect personal information from 
            children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">8. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting 
            the new policy on this page and updating the "Last updated" date. Your continued use of our services after 
            changes are posted constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">9. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <div className="space-y-3 text-gray-600">
            <p><strong className="text-gray-800">Email:</strong> <a href="mailto:privacy@aureva.com" className="text-purple-600 hover:underline">privacy@aureva.com</a></p>
            <p><strong className="text-gray-800">Phone:</strong> +1 (555) 123-4567</p>
            <p><strong className="text-gray-800">Address:</strong> 123 Beauty Avenue, New York, NY 10001</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <FiShield className="text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">We Value Your Trust</h2>
          <p className="mb-6">
            Your privacy and security are our top priorities. We're committed to transparency and protecting your data.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/terms"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Terms of Service
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
