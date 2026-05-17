import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiEdit2, FiHome, FiMapPin, FiPhone, FiPlus, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import axios from '../../api/axios';
import AccountLayout from '../../components/common/AccountLayout';
import EmptyState from '../../components/common/EmptyState';

const emptyForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  isDefault: false,
};

export default function Addresses() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    document.title = 'My Addresses - Aureva Beauty';
    fetchAddresses();
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, [user, navigate]);

  if (!user) return null;

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/addresses');
      setAddresses(response.data || []);
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAddress(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States',
      isDefault: Boolean(address.isDefault),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      if (editingAddress) {
        await axios.put(`/addresses/${editingAddress.id}`, formData);
        toast.success('Address updated');
      } else {
        await axios.post('/addresses', formData);
        toast.success('Address added');
      }

      closeModal();
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      await axios.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`/addresses/${id}`, { isDefault: true });
      toast.success('Default address updated');
      fetchAddresses();
    } catch {
      toast.error('Failed to set default address');
    }
  };

  return (
    <AccountLayout
      user={user}
      title="Addresses"
      subtitle="Keep your delivery addresses ready for faster checkout."
      action={(
        <button type="button" onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <FiPlus className="h-4 w-4" />
          Add address
        </button>
      )}
    >
      {loading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
          <BiLoaderAlt className="mx-auto h-8 w-8 animate-spin text-plum-900" />
          <p className="mt-3 text-sm font-medium text-stone-600">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={FiMapPin}
          title="No addresses yet"
          message="Add a shipping address so checkout is ready when you are."
          actionText="Add address"
          actionOnClick={openCreate}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
                    <FiHome className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-stone-950">{address.fullName}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                      <FiPhone className="h-4 w-4" />
                      {address.phone}
                    </p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold text-plum-900">
                    <MdCheckCircle className="h-4 w-4" />
                    Default
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-1 text-sm leading-6 text-stone-600">
                <p className="font-medium text-stone-800">{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-200 pt-4">
                {!address.isDefault && (
                  <button type="button" onClick={() => handleSetDefault(address.id)} className="btn-secondary px-4 py-2 text-sm">
                    Set default
                  </button>
                )}
                <button type="button" onClick={() => handleEdit(address)} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
                  <FiEdit2 className="h-4 w-4" />
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(address.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                  <FiTrash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-stone-200 p-6">
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">{editingAddress ? 'Edit address' : 'Add address'}</h2>
                <p className="mt-1 text-sm text-stone-500">Use accurate delivery details for smoother checkout.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full name" icon={FiUser} value={formData.fullName} onChange={(value) => setFormData({ ...formData, fullName: value })} required />
                <Input label="Phone" icon={FiPhone} value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} required />
              </div>
              <Input label="Address line 1" icon={FiHome} value={formData.addressLine1} onChange={(value) => setFormData({ ...formData, addressLine1: value })} required />
              <Input label="Address line 2" value={formData.addressLine2} onChange={(value) => setFormData({ ...formData, addressLine2: value })} />
              <div className="grid gap-5 md:grid-cols-3">
                <Input label="City" value={formData.city} onChange={(value) => setFormData({ ...formData, city: value })} required />
                <Input label="State" value={formData.state} onChange={(value) => setFormData({ ...formData, state: value })} required />
                <Input label="ZIP code" value={formData.zipCode} onChange={(value) => setFormData({ ...formData, zipCode: value })} required />
              </div>
              <Input label="Country" value={formData.country} onChange={(value) => setFormData({ ...formData, country: value })} required />

              <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-ivory-50 p-4 text-sm font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-plum-900 focus:ring-plum-800"
                />
                Set as default shipping address
              </label>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button type="submit" disabled={saving} className="btn-primary inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-60">
                  {saving && <BiLoaderAlt className="h-5 w-5 animate-spin" />}
                  {editingAddress ? 'Update address' : 'Add address'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}

function Input({ label, value, onChange, icon: Icon, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}{required ? ' *' : ''}</span>
      <span className="relative block">
        {Icon && <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />}
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input ${Icon ? 'pl-12' : ''}`}
        />
      </span>
    </label>
  );
}
