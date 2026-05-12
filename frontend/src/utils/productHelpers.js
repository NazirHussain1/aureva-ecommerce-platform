/**
 * Product stock helper functions
 */

/**
 * Check if product stock is low (less than 10 items)
 * @param {number} stock - Current stock quantity
 * @returns {boolean}
 */
export const isLowStock = (stock) => {
  return stock > 0 && stock < 10;
};

/**
 * Check if product is out of stock
 * @param {number} stock - Current stock quantity
 * @returns {boolean}
 */
export const isOutOfStock = (stock) => {
  return stock === 0 || stock === null || stock === undefined;
};

/**
 * Check if product is in stock
 * @param {number} stock - Current stock quantity
 * @returns {boolean}
 */
export const isInStock = (stock) => {
  return stock > 0;
};

/**
 * Get stock status label
 * @param {number} stock - Current stock quantity
 * @returns {string}
 */
export const getStockStatus = (stock) => {
  if (isOutOfStock(stock)) return 'Out of Stock';
  if (isLowStock(stock)) return 'Low Stock';
  return 'In Stock';
};

/**
 * Get stock status color class
 * @param {number} stock - Current stock quantity
 * @returns {string}
 */
export const getStockStatusColor = (stock) => {
  if (isOutOfStock(stock)) return 'text-red-600';
  if (isLowStock(stock)) return 'text-orange-600';
  return 'text-green-600';
};
