import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone, Truck } from 'lucide-react';
import config from '../data/config';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-terracotta bg-chocolate text-white/75">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="footer-reveal grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <section className="footer-column">
            <Link to="/" className="mb-4 flex w-fit items-center gap-2" aria-label="Rasito home">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-sm font-extrabold text-dark">R</span>
              <span className="text-xl font-bold tracking-tight text-white">Rasito</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Cakes, pastries, patties, and more from local bakery suppliers, delivered to your door.
            </p>
            <Link to="/menu" className="footer-link mt-5 inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
              Explore the menu <ArrowUpRight size={15} />
            </Link>
          </section>

          <section className="footer-column">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Explore</h2>
            <ul className="space-y-3">
              {[
                { to: '/menu', label: 'Browse the menu' },
                { to: '/cart', label: 'Shopping cart' },
                { to: '/orders', label: 'Order history' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer-link inline-flex items-center text-sm text-white/60">{label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-column">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Delivery</h2>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-terracotta" />
                <span>{config.delivery.areas.join(' · ')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Truck size={15} className="mt-0.5 shrink-0 text-terracotta" />
                <span>{config.delivery.estimatedTime} estimated delivery</span>
              </li>
              <li className="pl-[23px]">
                {config.delivery.fee === 0 ? 'Free delivery' : `Delivery fee ₹${config.delivery.fee}`}
                {config.delivery.freeAbove && ` · Free above ₹${config.delivery.freeAbove}`}
              </li>
              <li className="pl-[23px]">
                {config.paymentOptions.filter((option) => option.enabled).map((option) => option.label).join(' · ')}
              </li>
            </ul>
          </section>

          <section className="footer-column">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Contact & hours</h2>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <Clock size={15} className="mt-0.5 shrink-0 text-terracotta" />
                <span>Weekdays {config.openingHours.weekdays}<br />Weekends {config.openingHours.weekends}</span>
              </li>
              <li>
                <a className="footer-link inline-flex items-center gap-2" href={`tel:${config.contactPhone}`}>
                  <Phone size={15} className="shrink-0 text-terracotta" />
                  {config.contactPhone}
                </a>
              </li>
              {config.whatsappNumber && (
                <li>
                  <a
                    className="footer-link inline-flex items-center gap-2"
                    href={`https://wa.me/${config.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={15} className="shrink-0 text-terracotta" />
                    Message us on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {config.businessName}. Local bakery ordering made easy.</p>
          <p>{config.orderConfirmationNote}</p>
          {config.isDemoMode && (
            <span className="w-fit rounded-full bg-white/5 px-2.5 py-1 font-medium text-white/55">
              Demo · Sample data
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
