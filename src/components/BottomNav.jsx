import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ClipboardList, ShoppingCart } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/menu', icon: ShoppingBag, label: 'Menu' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 shadow-[0_-8px_24px_rgba(31,32,29,0.06)] backdrop-blur-md md:hidden pb-safe"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[68px] max-w-xl items-center justify-around px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 transition-all ${
                isActive
                  ? 'text-dark'
                  : 'text-muted hover:text-dark'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex h-8 w-10 items-center justify-center rounded-full transition-all ${
                    isActive ? 'bg-terracotta text-dark' : ''
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                </div>
                <span className={`text-[9px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
