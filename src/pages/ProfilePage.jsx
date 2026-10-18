import { Link } from 'react-router-dom';
import { ArrowLeft, UserRound, ShoppingBag, ClipboardList, Settings, ChevronRight, Info, Clock, Truck, MapPin } from 'lucide-react';
import config from '../data/config';

const profileLinks = [
  { to: '/orders', icon: ClipboardList, title: 'My Orders', detail: 'View your order history' },
  { to: '/cart', icon: ShoppingBag, title: 'My Cart', detail: 'Review items in your cart' },
  { to: '/menu', icon: Settings, title: 'Browse Menu', detail: 'Explore all products' },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 pb-24 pt-3 sm:px-6 md:py-6">
      <div className="grid grid-cols-[40px_1fr_40px] items-center">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-sm transition hover:bg-cream" aria-label="Back to home">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-center text-sm font-semibold text-dark">Profile</h1>
        <span aria-hidden="true" />
      </div>

      <div className="mb-7 mt-7 text-center">
        <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#f6e6a8] shadow-sm">
          <UserRound size={39} strokeWidth={1.6} className="text-dark" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-dark">Your Profile</h2>
        <p className="mt-1 text-xs text-muted">Manage your GaonBites experience</p>
      </div>

      <div className="space-y-2.5">
        {profileLinks.map(({ to, icon: Icon, title, detail }) => (
          <Link
            key={to}
            to={to}
            className="group flex min-h-[66px] items-center justify-between rounded-2xl bg-white px-3.5 py-3 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1b7] text-dark">
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">{title}</p>
                <p className="mt-0.5 text-[11px] text-muted">{detail}</p>
              </div>
            </div>
            <ChevronRight size={17} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-dark" />
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-dark">About {config.businessName}</h2>
        <div className="space-y-2.5 text-xs text-muted">
          <p className="flex items-center gap-2"><Clock size={14} className="text-dark" /> Weekdays: {config.openingHours.weekdays}</p>
          <p className="flex items-center gap-2"><Clock size={14} className="text-dark" /> Weekends: {config.openingHours.weekends}</p>
          <p className="flex items-center gap-2"><Truck size={14} className="text-dark" /> Delivery fee: ₹{config.delivery.fee}{config.delivery.freeAbove && ` (Free above ₹${config.delivery.freeAbove})`}</p>
          <p className="flex items-center gap-2"><MapPin size={14} className="text-dark" /> Delivery: {config.delivery.estimatedTime}</p>
        </div>
      </div>

      {config.isDemoMode && (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="text-xs text-amber-800">
              <p className="mb-1 font-semibold">Demo Mode</p>
              <p className="leading-relaxed">
                This app is running in demo mode with sample data. User accounts, order tracking, and real-time status updates will be available after backend integration with Supabase.
              </p>
            </div>
          </div>
        </div>
      )}

      {config.isDemoMode && (
        <Link to="/admin" className="mt-4 block text-center text-xs text-muted transition hover:text-dark">
          Admin Dashboard (Demo) →
        </Link>
      )}
    </div>
  );
}
