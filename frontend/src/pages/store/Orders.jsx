import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheckCircle, FiClock, FiEye, FiPackage, FiTruck, FiX, FiXCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdShoppingBag } from 'react-icons/md';
import axios from '../../api/axios';
import AccountLayout from '../../components/common/AccountLayout';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { getProductUrl } from '../../utils/helpers';

const statusStyles = {
  placed: 'bg-blue-50 text-blue-700 border-blue-100',
  processing: 'bg-amber-50 text-amber-700 border-amber-100',
  shipped: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  returned: 'bg-stone-100 text-stone-700 border-stone-200',
};

const statusIcons = {
  placed: FiClock,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
  returned: FiXCircle,
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    document.title = 'My Orders - Aureva Beauty';
    fetchOrders();
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, [user, navigate]);

  if (!user) return null;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders');
      setOrders(response.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout
      user={user}
      title="Orders"
      subtitle="Track purchases, delivery progress, and order totals."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <SkeletonLoader variant="card" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={MdShoppingBag}
          title="No orders yet"
          message="Your order history will appear here after checkout."
          actionText="Browse products"
          actionOnClick={() => navigate('/products')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onView={() => setSelectedOrder(order)} />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </AccountLayout>
  );
}

function OrderCard({ order, onView }) {
  const items = order.OrderItems || [];
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
            <FiPackage className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-stone-950">Order #{order.id}</h2>
            <p className="mt-1 text-sm text-stone-500">{orderDate} · {items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-5 space-y-3">
        {items.slice(0, 2).map((orderItem) => (
          <OrderItem key={orderItem.id} orderItem={orderItem} compact />
        ))}
        {items.length > 2 && (
          <p className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-500">
            +{items.length - 2} more {items.length - 2 === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">Total</p>
          <p className="mt-1 text-xl font-semibold text-stone-950">${Number(order.totalAmount).toFixed(2)}</p>
        </div>
        <button type="button" onClick={onView} className="btn-secondary inline-flex items-center justify-center gap-2">
          <FiEye className="h-4 w-4" />
          View details
        </button>
      </div>
    </article>
  );
}

function OrderItem({ orderItem, compact = false }) {
  const product = orderItem.Product;
  return (
    <div className="flex gap-4 rounded-lg bg-stone-50 p-3">
      <Link to={product ? getProductUrl(product) : '#'} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
        {product?.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-stone-300">
            <HiSparkles className="h-6 w-6" />
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-900">{product?.name || 'Product'}</p>
        <p className="mt-1 text-sm text-stone-500">Qty {orderItem.quantity} · ${Number(orderItem.price).toFixed(2)} each</p>
        {!compact && (
          <p className="mt-2 text-sm font-semibold text-stone-900">
            ${(orderItem.price * orderItem.quantity).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const Icon = statusIcons[status] || FiPackage;
  const label = status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : 'Placed';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[status] || statusStyles.placed}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

function OrderModal({ order, onClose }) {
  const items = order.OrderItems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-stone-200 p-6">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">Order #{order.id}</h2>
            <p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <StatusBadge status={order.orderStatus} />
            <p className="text-2xl font-semibold text-stone-950">${Number(order.totalAmount).toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <OrderItem key={item.id} orderItem={item} />
            ))}
          </div>

          <div className="grid gap-4 rounded-lg border border-stone-200 bg-ivory-50 p-4 sm:grid-cols-2">
            <Detail label="Payment method" value={order.paymentMethod?.replace('_', ' ') || 'Not available'} />
            <Detail label="Order status" value={order.orderStatus || 'Placed'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-stone-950">{value}</p>
    </div>
  );
}
