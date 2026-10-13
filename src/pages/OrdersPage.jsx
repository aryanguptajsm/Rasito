import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, Truck, Package, XCircle, ChevronRight, Info } from 'lucide-react';
import { orderService } from '../services/dataService';
import config from '../data/config';

const STATUS_MAP = {
  pending: {
    label: 'Pending Confirmation',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50',
    desc: 'Waiting for bakery to confirm',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'text-blue-600 bg-blue-50',
    desc: 'Order accepted by bakery',
  },
  preparing: {
    label: 'Preparing',
    icon: Package,
    color: 'text-purple-600 bg-purple-50',
    desc: 'Your order is being prepared',
  },
  out: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-green-600 bg-green-50',
    desc: 'On its way to you',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-green-700 bg-green-50',
    desc: 'Successfully delivered',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600 bg-red-50',
    desc: 'Order was cancelled',
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAll().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-cream p-6 rounded-full mb-5">
          <ClipboardList size={48} className="text-muted" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-2">No Orders Yet</h2>
        <p className="text-sm text-muted max-w-xs mb-4">
          When you place an order via WhatsApp, it will appear here.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 max-w-sm text-left">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>How ordering works:</strong> You send your order via WhatsApp. The bakery
              reviews it and confirms availability. Orders shown here are locally saved — the bakery
              manages confirmations via WhatsApp.
            </p>
          </div>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-terracotta text-white font-semibold px-6 py-3 rounded-full hover:bg-terracotta/90 transition-all"
        >
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">My Orders</h1>
        <p className="text-xs text-muted mt-1">{orders.length} order{orders.length !== 1 && 's'}</p>
      </div>

      {/* Process info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            {config.orderConfirmationNote}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
          const StatusIcon = status.icon;
          const date = new Date(order.createdAt);

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted font-mono">{order.id}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {date.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {date.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}
                >
                  <StatusIcon size={12} />
                  {status.label}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-dark">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-peach/20 pt-2 flex justify-between">
                <span className="text-sm font-medium text-dark">Total</span>
                <span className="text-sm font-bold text-chocolate">₹{order.total}</span>
              </div>

              {order.customer && (
                <p className="text-xs text-muted mt-2">
                  📍 {order.customer.village} · {order.customer.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
