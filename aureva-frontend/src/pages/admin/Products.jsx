import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiImage, FiPackage } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdFilterList } from 'react-icons/md';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'skincare',
    stock: '',
    brand: '',
    images: ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'skincare', label: 'Skincare' },
    { value: 'haircare', label: 'Haircare' },
    { value: 'makeup', label: 'Makeup' },
    { value: 'fragrance', label: 'Fragrance' },
    { value: 'men', label: "Men's Care" },
    { value: 'women', label: "Women's Care" },
    { value: 'kids', label: "Kids' Care" },
    { value: 'wellness', label: 'Wellness' }
  ];

  const stockFilters = [
    { value: '', label: 'All Stock' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock (<10)' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
      };

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/api/admin/products', productData);
        toast.success('Product created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      brand: product.brand || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'skincare',
      stock: '',
      brand: '',
      images: ''
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStock = !filterStock || 
      (filterStock === 'in_stock' && product.stock > 10) ||
      (filterStock === 'low_stock' && product.stock > 0 && product.stock <= 10) ||
      (filterStock === 'out_of_stock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStockBadge = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'bg-red-100 text-red-700' };
    if (stock <= 10) return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-700' };
    return { text: 'In Stock', class: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-gray-600">{filteredProducts.length} total products</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 animate-slideInUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 font-medium"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 font-medium"
          >
            {stockFilters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory || filterStock 
                ? 'Try adjusting your filters' 
                : 'Get started by adding your first product'}
            </p>
            {!searchTerm && !filterCategory && !filterStock && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg"
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => {
                    const stockBadge = getStockBadge(product.stock);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <HiSparkles className="text-2xl text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.brand || 'No brand'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{product.stock}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${stockBadge.class}`}>
                            {stockBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modalFadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-t-3xl relative">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <FiX className="text-2xl" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiPackage className="text-2xl" />
                </div>
                <h2 className="text-3xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <p className="text-purple-100">
                {editingProduct ? 'Update product details' : 'Fill in the product information'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Hydrating Face Serum"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea"
                  rows="4"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    {categories.filter(c => c.value).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="input"
                    placeholder="e.g., Aureva"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiImage className="inline mr-2" />
                  Image URLs (comma-separated)
                </label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="textarea"
                  rows="3"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Enter multiple image URLs separated by commas</p>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-bold active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
