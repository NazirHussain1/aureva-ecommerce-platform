import { CATEGORIES } from '../../utils/constants';

export default function ProductFilter({ filters, onFilterChange }) {
  const handleCategoryChange = (categoryValue, checked) => {
    let newCategories = filters.category || [];
    if (checked) {
      newCategories = [...newCategories, categoryValue];
    } else {
      newCategories = newCategories.filter((c) => c !== categoryValue);
    }
    onFilterChange({ ...filters, category: newCategories });
  };

  const handleMaxPriceChange = (value) => {
    onFilterChange({ ...filters, maxPrice: Number(value) });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h3 className="font-semibold text-xl mb-6">Filters</h3>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={filters.category?.includes(category.value) || false}
                onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="capitalize">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">Price Range</h4>
        <input
          type="range"
          min="0"
          max="500"
          value={filters.maxPrice || 500}
          onChange={(e) => handleMaxPriceChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>$0</span>
          <span>${filters.maxPrice || 500}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">Sort By</h4>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({})}
        className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition"
      >
        Clear Filters
      </button>
    </div>
  );
}
