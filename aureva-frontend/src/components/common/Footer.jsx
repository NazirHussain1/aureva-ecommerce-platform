import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiSparkles className="text-3xl text-pink-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Aureva Beauty
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your trusted destination for premium beauty and wellness products. Discover your natural radiance with our curated collection.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <FiMail className="text-pink-500" />
                <span>support@aureva.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiPhone className="text-pink-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiMapPin className="text-pink-500" />
                <span>123 Beauty Ave, NY 10001</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=skincare" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Skincare
                </Link>
              </li>
              <li>
                <Link to="/products?category=makeup" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=haircare" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Haircare
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrance" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Fragrance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">About Us</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link to="/about" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition flex items-center gap-2">
                  <span className="text-pink-500">›</span>
                  Terms of Service
                </a>
              </li>
            </ul>
            
            <h4 className="text-white font-bold mb-3 text-sm">Follow Us</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-gray-300 group-hover:text-white transition" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <FaInstagram className="text-gray-300 group-hover:text-white transition" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-gray-300 group-hover:text-white transition" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 transition-all duration-300 group"
                aria-label="YouTube"
              >
                <FaYoutube className="text-gray-300 group-hover:text-white transition" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Aureva Beauty. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-pink-400 transition">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-pink-400 transition">Terms</a>
            <a href="#" className="text-gray-500 hover:text-pink-400 transition">Cookies</a>
            <a href="#" className="text-gray-500 hover:text-pink-400 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
