import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, X, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import config from '../data/config';

export default function Header({ onSearch }) {
  const { itemCount, subtotal } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Select your village');
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-peach/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0" aria-label="GaonBites Home">
            <span className="text-xl sm:text-2xl">🧁</span>
            <span className="font-bold text-lg sm:text-xl text-chocolate tracking-tight">
              Gaon<span className="text-terracotta">Bites</span>
            </span>
          </Link>

          {/* Location selector - hidden on very small screens */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-1 text-sm text-muted hover:text-chocolate transition-colors px-2 py-1.5 rounded-lg hover:bg-cream"
              aria-label="Select delivery location"
            >
              <MapPin size={14} className="text-terracotta shrink-0" />
              <span className="truncate max-w-[140px] lg:max-w-[200px]">{selectedArea}</span>
              <ChevronDown size={14} />
            </button>
            {locationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLocationOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-peach/30 py-1 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-muted uppercase tracking-wider">
                    Delivery Areas
                  </div>
                  {config.delivery.areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-cream transition-colors ${
                        selectedArea === area ? 'text-terracotta font-medium' : 'text-dark'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for cakes, pastries, snacks..."
                className="w-full pl-9 pr-4 py-2 bg-cream/60 border border-peach/30 rounded-full text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 transition-all"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-full hover:bg-cream text-muted hover:text-chocolate transition-colors"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 p-2 rounded-full hover:bg-cream text-muted hover:text-chocolate transition-colors"
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for cakes, pastries, snacks..."
                className="w-full pl-9 pr-4 py-2.5 bg-cream/60 border border-peach/30 rounded-full text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50"
              />
            </div>
          </form>
        )}

        {/* Mobile location */}
        <div className="sm:hidden pb-2 -mt-1">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-1 text-xs text-muted"
            aria-label="Select delivery location"
          >
            <MapPin size={12} className="text-terracotta" />
            <span className="truncate max-w-[200px]">{selectedArea}</span>
            <ChevronDown size={10} />
          </button>
          {locationOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLocationOpen(false)} />
              <div className="absolute left-3 right-3 mt-1 bg-white rounded-xl shadow-lg border border-peach/30 py-1 z-50">
                <div className="px-3 py-2 text-xs font-medium text-muted uppercase tracking-wider">
                  Delivery Areas
                </div>
                {config.delivery.areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedArea(area);
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm hover:bg-cream transition-colors ${
                      selectedArea === area ? 'text-terracotta font-medium' : 'text-dark'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
