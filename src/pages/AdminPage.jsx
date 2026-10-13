import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Package, ClipboardList, Settings, AlertTriangle, Edit3, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, DollarSign, Truck, Clock, Phone, Eye, EyeOff,
} from 'lucide-react';
import { productService, orderService } from '../services/dataService';
import config from '../data/config';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    productService.getAllIncludingUnavailable().then(setProducts);
    orderService.getAll().then(setOrders);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      const updated = await orderService.getAll();
      setOrders(updated);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          to="/"
          className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-dark transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">Admin Dashboard</h1>
          <p className="text-xs text-muted">Manage products, orders, and settings</p>
        </div>
      </div>

      {/* Demo Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          {config.admin.demoNote}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream rounded-xl p-1 mb-5 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
              activeTab === id
                ? 'bg-white text-chocolate shadow-sm'
                : 'text-muted hover:text-dark'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-dark">{products.length} Products</h2>
            <span className="text-xs text-muted bg-cream px-2 py-1 rounded-full">
              Edit in src/data/products.js
            </span>
          </div>
          <div className="bg-white rounded-xl border border-peach/20 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream/50 border-b border-peach/20">
                    <th className="text-left px-4 py-3 font-medium text-muted text-xs">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-muted text-xs">Category</th>
                    <th className="text-right px-4 py-3 font-medium text-muted text-xs">Price</th>
                    <th className="text-center px-4 py-3 font-medium text-muted text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-peach/10">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-dark">{product.name}</span>
                          {product.isBestseller && (
                            <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-full">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted capitalize">{product.category.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-right font-medium text-chocolate">₹{product.price}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            product.available
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-muted text-center">
            To add, edit, or disable products, modify the PRODUCTS array in{' '}
            <code className="bg-cream px-1 py-0.5 rounded text-chocolate">src/data/products.js</code>
          </p>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <h2 className="font-semibold text-dark">{orders.length} Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-peach/20 p-8 text-center shadow-sm">
              <ClipboardList size={32} className="mx-auto text-muted mb-2" />
              <p className="text-sm text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-mono text-muted">{order.id}</p>
                      <p className="text-xs text-muted">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                      {order.customer && (
                        <p className="text-sm text-dark font-medium mt-1">
                          {order.customer.name} · {order.customer.phone}
                        </p>
                      )}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs border border-peach/30 rounded-lg px-2 py-1.5 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 text-sm">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-muted">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-peach/20 pt-2 mt-2 flex justify-between">
                    <span className="font-medium text-dark text-sm">Total</span>
                    <span className="font-bold text-chocolate">₹{order.total}</span>
                  </div>
                  {order.customer?.address && (
                    <p className="text-xs text-muted mt-2">
                      📍 {order.customer.address}, {order.customer.village}
                      {order.customer.landmark && ` (near ${order.customer.landmark})`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-dark">Configuration</h2>
          <p className="text-xs text-muted">
            These settings are read from{' '}
            <code className="bg-cream px-1 py-0.5 rounded text-chocolate">src/data/config.js</code>.
            Edit that file to change them.
          </p>

          <div className="space-y-3">
            {/* WhatsApp */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm">
              <h3 className="font-medium text-dark text-sm flex items-center gap-2 mb-2">
                <Phone size={14} className="text-terracotta" />
                WhatsApp Number
              </h3>
              <p className="text-sm text-muted font-mono">
                {config.whatsappNumber || (
                  <span className="text-amber-600">Not configured — set in config.js</span>
                )}
              </p>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm">
              <h3 className="font-medium text-dark text-sm flex items-center gap-2 mb-2">
                <Truck size={14} className="text-terracotta" />
                Delivery Settings
              </h3>
              <div className="space-y-1 text-sm text-muted">
                <p>Fee: ₹{config.delivery.fee}</p>
                <p>Free above: ₹{config.delivery.freeAbove || 'N/A'}</p>
                <p>Minimum order: ₹{config.delivery.minimumOrder || 'None'}</p>
                <p>Estimated time: {config.delivery.estimatedTime}</p>
                <p>Service areas: {config.delivery.areas.join(', ')}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 shadow-sm">
              <h3 className="font-medium text-dark text-sm flex items-center gap-2 mb-2">
                <Clock size={14} className="text-terracotta" />
                Opening Hours
              </h3>
              <div className="space-y-1 text-sm text-muted">
                <p>Weekdays: {config.openingHours.weekdays}</p>
                <p>Weekends: {config.openingHours.weekends}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
