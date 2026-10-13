import { NavLink } from 'react-router-dom';
import { Home, Grid3X3, ClipboardList, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/menu', icon: Grid3X3, label: 'Menu' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-peach/30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl min-w-[56px] transition-all ${
                isActive
                  ? 'text-terracotta'
                  : 'text-muted hover:text-chocolate'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-all ${
                    isActive ? 'bg-terracotta/10' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
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
