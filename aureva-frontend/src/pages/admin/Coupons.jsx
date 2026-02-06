import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';

function CouponCard({ coupon }) {
  const isActive = new Date(coupon.expiryDate) > new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-purple-600">{coupon.code}</h3>
          <p className="text-sm text-gray-500">{coupon.discount}% off</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? 'Active' : 'Expired'}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>Min Purchase: ${coupon.minPurchase}</p>
        <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm">Edit</button>
        <button className="flex-1 text-red-600 hover:text-red-800 text-sm">Delete</button>
      </div>
    </div>
  );
}

function CouponModal({ isOpen, onClose, formData, setFormData, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Coupon</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="SUMMER2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase ($)</label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create
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
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    minPurchase: ''
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCoupon = { ...formData, id: Date.now() };
    setCoupons([...coupons, newCoupon]);
    setShowModal(false);
    setFormData({ code: '', discount: '', expiryDate: '', minPurchase: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coupons Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Create Coupon
        </button>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No coupons created</h2>
          <p className="text-gray-600 mb-6">Create your first coupon to offer discounts</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}

      <CouponModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
