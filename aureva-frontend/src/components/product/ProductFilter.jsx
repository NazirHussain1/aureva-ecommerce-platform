import { CATEGORIES } from '../../utils/constants';

export default function ProductFilter({ filters, onFilterChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category?.includes(category.value)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...(filters.category || []), category.value]
                    : filters.category.filter((c) => c !== category.value);
                  onFilterChange({ ...filters, category: newCategories });
                }}
                className="mr-2"
              />
              <span className="text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.maxPrice || 500}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.maxPrice || 500}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Sort By</h4>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
        className="w-full btn-secondary"
      >
        Clear Filters
      </button>
    </div>
  );
}
