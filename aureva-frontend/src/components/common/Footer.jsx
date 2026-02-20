import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn, FaPinterestP } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { BiLoaderAlt } from 'react-icons/bi';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { getPublicSettings } from '../../api/settingsApi';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getPublicSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setSubscribing(true);
      await axios.post('/api/newsletter/subscribe', { email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiSparkles className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Aureva
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted destination for premium beauty and wellness products. Discover your natural radiance with our curated collection of luxury essentials.
            </p>
            <div className="space-y-3">
              <a href={`mailto:${settings?.contactEmail || 'support@aureva.com'}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-colors group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                  <FiMail className="text-pink-500 group-hover:text-white transition-colors" />
                </div>
                <span>{settings?.contactEmail || 'support@aureva.com'}</span>
              </a>
              <a href={`tel:${settings?.phone || '+15551234567'}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-pink-400 transition-colors group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                  <FiPhone className="text-pink-500 group-hover:text-white transition-colors" />
                </div>
                <span>{settings?.phone || '+1 (555) 123-4567'}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FiMapPin className="text-pink-500" />
                </div>
                <span>{settings?.address || '123 Beauty Ave, NY 10001'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/products" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=skincare" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Skincare
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=makeup" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Makeup
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=haircare" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Haircare
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=fragrance" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Fragrance
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=wellness" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Wellness
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/orders" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Track Order
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  My Account
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-gray-400 hover:text-pink-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {subscribing ? (
                    <BiLoaderAlt className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>

            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Follow Us</h5>
              <div className="flex gap-3">
                {settings?.facebookUrl && (
                  <a 
                    href={settings.facebookUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.instagramUrl && (
                  <a 
                    href={settings.instagramUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.twitterUrl && (
                  <a 
                    href={settings.twitterUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                )}
                {settings?.youtubeUrl && (
                  <a 
                    href={settings.youtubeUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                )}
                {!settings?.facebookUrl && !settings?.instagramUrl && !settings?.twitterUrl && !settings?.youtubeUrl && (
                  <>
                    <a 
                      href="https://facebook.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label="Facebook"
                    >
                      <FaFacebookF className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label="Twitter"
                    >
                      <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label="YouTube"
                    >
                      <FaYoutube className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="https://pinterest.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label="Pinterest"
                    >
                      <FaPinterestP className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-sm text-gray-500">
                © {currentYear} Aureva Beauty. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Made with</span>
                <span className="text-pink-500 animate-pulse">❤</span>
                <span className="text-xs text-gray-600">for beauty lovers</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/privacy" 
                className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/about" 
                className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
              >
                About Us
              </Link>
              <Link 
                to="/careers" 
                className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
