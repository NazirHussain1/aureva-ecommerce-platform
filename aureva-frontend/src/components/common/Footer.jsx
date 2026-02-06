import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Aureva Beauty</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted beauty destination for premium skincare, makeup, and wellness products crafted to enhance your natural glow.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-pink-500 transition">Products</Link></li>
              <li><Link to="/orders" className="hover:text-pink-500 transition">Orders</Link></li>
              <li><Link to="/profile" className="hover:text-pink-500 transition">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-pink-500 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">Returns Policy</a></li>
              <li><a href="#" className="hover:text-pink-500 transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          © 2026 Aureva Beauty. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
