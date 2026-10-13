import { Link } from 'react-router-dom';
import { Phone, Clock, MapPin, Mail, ChevronRight } from 'lucide-react';
import config from '../data/config';

export default function Footer() {
  return (
    <footer className="bg-chocolate text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧁</span>
              <span className="font-bold text-xl text-white">
                Gaon<span className="text-terracotta">Bites</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Your village bakery, now just a tap away. Fresh cakes, pastries, patties and more
              delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/menu', label: 'Full Menu' },
                { to: '/cart', label: 'My Cart' },
                { to: '/orders', label: 'My Orders' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-terracotta transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 shrink-0" />
                <div>
                  <p>Weekdays: {config.openingHours.weekdays}</p>
                  <p>Weekends: {config.openingHours.weekends}</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0" />
                <span>Local delivery in village area</span>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Info
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Delivery Info', href: '#delivery-info' },
                { label: 'Cancellation Policy', href: '#cancellation' },
                { label: 'Privacy', href: '#privacy' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-white/60 hover:text-terracotta transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={12} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {config.businessName}. Made with ❤️ for local bakeries.
          </p>
          {config.isDemoMode && (
            <span className="text-[10px] text-terracotta/80 bg-terracotta/10 px-2 py-1 rounded-full font-medium">
              ⚠️ Demo Mode — Sample data
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
