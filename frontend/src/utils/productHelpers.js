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
