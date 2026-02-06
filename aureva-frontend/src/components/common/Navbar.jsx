import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { search } = useLocation();

  const categories = [
    { name: 'Skincare', value: 'skincare' },
    { name: 'Makeup', value: 'makeup' },
    { name: 'Haircare', value: 'haircare' },
    { name: 'Fragrance', value: 'fragrance' },
    { name: 'Wellness', value: 'personal wellness' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 py-3">

          {categories.map((cat) => {
            const active = search.includes(cat.value);
            return (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition
                  ${active
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                  }`}
              >
                {cat.name}
              </Link>
            );
          })}

        </div>
      </div>
    </nav>
  );
}
