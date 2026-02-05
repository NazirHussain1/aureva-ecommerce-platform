import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../features/products/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="mb-4">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 object-cover rounded cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-pink-600' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-pink-600 font-medium mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-4xl font-bold text-pink-600 mb-6">{formatPrice(product.price)}</p>
          
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Stock: {product.stock > 0 ? (
                <span className="text-green-600 font-medium">{product.stock} available</span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <button className="w-12 h-12 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Category: {product.category}</li>
              <li>• Brand: {product.brand || 'Aureva'}</li>
              <li>• SKU: {product.id}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
