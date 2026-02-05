import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-center space-x-8 py-3">
          <Link to="/products?category=skincare" className="text-gray-700 hover:text-pink-600 transition">
            Skincare
          </Link>
          <Link to="/products?category=makeup" className="text-gray-700 hover:text-pink-600 transition">
            Makeup
          </Link>
          <Link to="/products?category=haircare" className="text-gray-700 hover:text-pink-600 transition">
            Haircare
          </Link>
          <Link to="/products?category=fragrance" className="text-gray-700 hover:text-pink-600 transition">
            Fragrance
          </Link>
          <Link to="/products?category=personal wellness" className="text-gray-700 hover:text-pink-600 transition">
            Wellness
          </Link>
        </div>
      </div>
    </nav>
  );
}
