import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import config from '../data/config';
import DeliveryLocationPicker from './DeliveryLocationPicker';

export default function Header({ onSearch, deliveryLocation, onDeliveryLocationChange }) {
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const selectedArea = deliveryLocation.area || (
    deliveryLocation.coordinates ? 'GPS pin saved' : 'Select your village'
  );

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch?.(searchQuery);
    if (searchQuery.trim()) navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const areaPicker = (
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className={`flex items-center gap-2 rounded-full transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-muted hover:bg-cream'} ${isHome ? 'px-0 py-1' : 'px-2 py-1.5'}`}
        aria-label="Select delivery location"
        aria-expanded={locationOpen}
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isHome ? 'bg-white/10' : 'bg-cream'}`}>
          <MapPin size={17} className={isHome ? 'text-terracotta' : 'text-terracotta'} />
        </span>
        <span className="text-left leading-tight">
          <span className={`block text-[10px] ${isHome ? 'text-white/55' : 'text-muted'}`}>Delivery location</span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${isHome ? 'text-white' : 'text-dark'}`}>
            {selectedArea}
            <ChevronDown size={12} />
          </span>
        </span>
      </button>
      {locationOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setLocationOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-black/5 bg-white p-4 text-dark shadow-xl animate-fade-in">
            <DeliveryLocationPicker
              id="header-delivery-area"
              value={deliveryLocation.area}
              coordinates={deliveryLocation.coordinates}
              areas={config.delivery.areas}
              onChange={(area) => onDeliveryLocationChange({ area })}
              onCoordinatesChange={(coordinates) => onDeliveryLocationChange({ coordinates })}
            />
          </div>
        </>
      )}
    </div>
  );

  const cartAction = (
    <Link
      to="/cart"
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isHome ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-dark shadow-sm hover:bg-cream'}`}
      aria-label={`Shopping cart, ${itemCount} items`}
    >
      <ShoppingCart size={18} />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-dark">
          {itemCount}
        </span>
      )}
    </Link>
  );

  if (isHome) {
    return (
      <header className="relative z-40 overflow-visible rounded-b-[28px] bg-[#11120f] text-white shadow-sm sm:rounded-b-[32px]">
        <div className="mx-auto max-w-7xl px-5 pb-6 pt-3 sm:px-8 sm:pb-8 sm:pt-5 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            {areaPicker}
            <div className="flex items-center gap-2">
              {cartAction}
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <p className="mb-1 text-xs font-medium text-white/55">{config.businessName}</p>
            <h1 className="max-w-xl text-[25px] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-3xl lg:text-4xl">
              What are you going to eat today?
            </h1>
            <p className="mt-2 text-xs text-white/55 sm:text-sm">{config.tagline}</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1.5 pl-3 sm:max-w-xl">
            <Search size={17} className="shrink-0 text-white/70" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search here..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/55"
              aria-label="Search menu"
            />
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-terracotta px-3 text-xs font-semibold text-dark transition-transform active:scale-95"
              aria-label="Browse filters and menu"
            >
              <span>Filter</span>
              <SlidersHorizontal size={14} />
            </button>
          </form>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-40 border-b border-black/5 bg-[#e7e8eb]/95 backdrop-blur-md ${location.pathname === '/cart' ? 'hidden md:block' : ''}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="GaonBites home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-base">🥐</span>
          <span className="text-base font-bold tracking-tight text-dark sm:text-lg">GaonBites</span>
        </Link>
        <div className="hidden sm:block">{areaPicker}</div>
        <form onSubmit={handleSearchSubmit} className="hidden max-w-md flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search the menu..."
              className="w-full rounded-full border border-black/5 bg-white py-2.5 pl-9 pr-4 text-sm text-dark outline-none transition focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/20"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          {cartAction}
        </div>
      </div>
    </header>
  );
}
