import { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

export default function Coupons() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'SAVE20', discount: 20, expiresAt: new Date('2024-12-31'), isActive: true },
    { id: 2, code: 'WELCOME10', discount: 10, expiresAt: new Date('2024-12-31'), isActive: true },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiresAt: '',
  });

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'discount', label: 'Discount', render: (value) => `${value}%` },
    { key: 'expiresAt', label: 'Expires', render: (value) => formatDate(value) },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleEdit = (coupon) => {
    console.log('Edit coupon:', coupon);
  };

  const handleDelete = (coupon) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter((c) => c.id !== coupon.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCoupons([...coupons, { ...formData, id: coupons.length + 1, isActive: true }]);
    setIsModalOpen(false);
    setFormData({ code: '', discount: '', expiresAt: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Coupon</Button>
      </div>

      <DataTable columns={columns} data={coupons} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Coupon"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />
          <Input
            label="Discount (%)"
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            required
          />
          <Input
            label="Expires At"
            type="date"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            required
          />
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">Create</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
