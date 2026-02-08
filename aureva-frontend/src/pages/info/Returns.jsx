import { Link } from 'react-router-dom';
import { FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Retu