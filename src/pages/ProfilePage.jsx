import { Link } from 'react-router-dom';
import { User, ShoppingBag, ClipboardList, Settings, ChevronRight, Phone, Info } from 'lucide-react';
import config from '../data/config';

export default function ProfilePage() {
  return (
    <div className="min-h-screen max-w-xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-cream p-5 rounded-full w-20 h-20 mx-auto mb-3 flex items-center justify-center">
          <User size={36} className="text-muted" />
        </div>
        <h1 className="text-xl font-bold text-dark">Your Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your GaonBites experience</p>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <Link
          to="/orders"
          className="flex items-center justify-between bg-white rounded-xl border border-peach/20 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-terracotta/10 p-2.5 rounded-xl">
              <ClipboardList size={18} className="text-terracotta" />
            </div>
            <div>
              <p className="font-medium text-dark text-sm">My Orders</p>
              <p className="text-xs text-muted">View your order history</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted group-hover:text-terracotta transition-colors" />
        </Link>

        <Link
          to="/cart"
          className="flex items-center justify-between bg-white rounded-xl border border-peach/20 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <ShoppingBag size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-dark text-sm">My Cart</p>
              <p className="text-xs text-muted">Review items in your cart</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted group-hover:text-terracotta transition-colors" />
        </Link>

        <Link
          to="/menu"
          className="flex items-center justify-between bg-white rounded-xl border border-peach/20 p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2.5 rounded-xl">
              <Settings size={18} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-dark text-sm">Browse Menu</p>
              <p className="text-xs text-muted">Explore all products</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted group-hover:text-terracotta transition-colors" />
        </Link>
      </div>

      {/* Business Info */}
      <div className="mt-8 bg-cream/50 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-dark text-sm">About {config.businessName}</h2>
        <div className="space-y-2 text-xs text-muted">
          <p className="flex items-center gap-2">
            🕐 Weekdays: {config.openingHours.weekdays}
          </p>
          <p className="flex items-center gap-2">
            🕐 Weekends: {config.openingHours.weekends}
          </p>
          <p className="flex items-center gap-2">
            🚚 Delivery fee: ₹{config.delivery.fee}
            {config.delivery.freeAbove && ` (Free above ₹${config.delivery.freeAbove})`}
          </p>
          <p className="flex items-center gap-2">
            📍 Delivery: {config.delivery.estimatedTime}
          </p>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {config.isDemoMode && (
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700">
              <p className="font-medium mb-1">Demo Mode</p>
              <p className="leading-relaxed">
                This app is running in demo mode with sample data. User accounts, order tracking,
                and real-time status updates will be available after backend integration with Supabase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin link (only visible in demo) */}
      {config.isDemoMode && (
        <Link
          to="/admin"
          className="mt-4 block text-center text-xs text-muted hover:text-terracotta transition-colors"
        >
          Admin Dashboard (Demo) →
        </Link>
      )}
    </div>
  );
}
