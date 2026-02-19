export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:5000${imagePath}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProductUrl = (product) => {
  if (product?.slug) {
    return `/products/${encodeURIComponent(product.slug)}`;
  }

  if (product?.id !== undefined && product?.id !== null) {
    return `/products/${product.id}`;
  }

  if (product?.name) {
    return `/products/${encodeURIComponent(product.name)}`;
  }

  return '/products';
};
