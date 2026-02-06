import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [query, setQuery] = useState(params.get('search') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skincare, makeup, brands..."
          className="w-full h-11 pl-11 pr-10 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm"
        />

        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
