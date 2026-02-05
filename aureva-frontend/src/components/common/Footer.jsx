import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-pink-400 mb-4">AUREVA</h3>
            <p className="text-gray-400">Your trusted beauty destination for premium skincare, makeup, and wellness products.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-pink-400 transition">Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-pink-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-pink-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/orders" className="text-gray-400 hover:text-pink-400 transition">Track Order</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-pink-400 transition">Returns</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-pink-400 transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and updates</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-lg text-gray-900 flex-1" />
              <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Aureva Beauty Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
