export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  const API_URL = import.meta.env.VITE_API_URL || '';
  return `${API_URL}${imagePath}`;
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
