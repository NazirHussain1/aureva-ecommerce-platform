import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';

function CouponCard({ coupon, onEdit, onDelete }) {
  const isActive = new Date(coupon.expiryDate) > new Date();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MdLocalOffer className="text-2xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{coupon.code}</h3>
            <p className="text-sm text-purple-600 font-semibold">{coupon.discount}% OFF</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isActive ? 'Active' : 'Expired'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiDollarSign className="text-gray-400" />
          <span>Min Purchase: ${coupon.minPurchase}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiCalendar className="text-gray-400" />
          <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(coupon)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
        >
          <FiEdit2 />
          Edit
        </button>
        <button
          onClick={() => onDelete(coupon.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
}

function CouponModal({ isOpen, onClose, formData, setFormData, onSubmit, isEditing }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiTag className="text-2xl" />
            {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="SUMMER2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%) *</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              min="1"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase ($) *</label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold"
            >
              {isEditing ? 'Update Coupon' : 'Create Coupon'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    minPurchase: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/coupons');
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const couponData = {
        code: formData.code,
        discount: parseFloat(formData.discount),
        expiryDate: formData.expiryDate,
        minPurchase: parseFloat(formData.minPurchase)
      };

      if (editingCoupon) {
        await axios.put(`/api/admin/coupons/${editingCoupon.id}`, couponData);
        toast.success('Coupon updated successfully!');
      } else {
        await axios.post('/api/admin/coupons', couponData);
        toast.success('Coupon created successfully!');
      }

      setShowModal(false);
      setEditingCoupon(null);
      setFormData({ code: '', discount: '', expiryDate: '', minPurchase: '' });
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiryDate: coupon.expiryDate.split('T')[0],
      minPurchase: coupon.minPurchase.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`/api/admin/coupons/${id}`);
        toast.success('Coupon deleted successfully!');
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupons Management</h1>
          <p className="text-gray-600">{coupons.length} {coupons.length === 1 ? 'coupon' : 'coupons'} total</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setFormData({ code: '', discount: '', expiryDate: '', minPurchase: '' });
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold shadow-md flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <BiLoaderAlt className="inline-block animate-spin h-12 w-12 text-purple-600" />
          <p className="text-gray-600 mt-4">Loading coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MdLocalOffer className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No coupons created</h2>
          <p className="text-gray-600 mb-6">Create your first coupon to offer discounts</p>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({ code: '', discount: '', expiryDate: '', minPurchase: '' });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition font-semibold inline-flex items-center gap-2"
          >
            <FiPlus className="text-xl" />
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <CouponCard 
              key={coupon.id} 
              coupon={coupon}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CouponModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCoupon(null);
          setFormData({ code: '', discount: '', expiryDate: '', minPurchase: '' });
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isEditing={!!editingCoupon}
      />
    </div>
  );
}
