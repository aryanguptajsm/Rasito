import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Sprout, Smartphone, ChevronRight, Gift } from 'lucide-react';
import { productService } from '../services/dataService';
import { CATEGORIES } from '../data/products';
import config from '../data/config';
import ProductCard from '../components/ProductCard';

export default function HomePage({ searchQuery = '' }) {
  const [bestsellers, setBestsellers] = useState([]);
  const [preOrderCakes, setPreOrderCakes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getBestsellers().then(setBestsellers);
    productService.getPreOrderCakes().then(setPreOrderCakes);
    productService.getAll().then(setAllProducts)
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (product) =>
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
  const visibleProducts = query ? allProducts.filter(matchesQuery) : allProducts;
  const visibleBestsellers = query ? bestsellers.filter(matchesQuery) : bestsellers;

  return (
    <div className="min-h-screen">
      {config.isDemoMode && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-medium text-muted shadow-sm">
            Demo Mode · Sample data for demonstration
          </span>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-2 pt-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">Today's Offer!</h2>
          <Link to="/menu" className="text-xs font-medium text-muted transition hover:text-dark">See all</Link>
        </div>
        <div className="relative flex min-h-[132px] items-center justify-between overflow-hidden rounded-[24px] bg-white p-4 shadow-sm sm:min-h-[160px] sm:px-6">
          <div className="relative z-10 max-w-[65%]">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/25 text-dark">
              <Truck size={17} />
            </div>
            <h3 className="text-base font-bold text-dark sm:text-lg">Free Delivery</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-muted sm:text-sm">
              {config.delivery.freeAbove
                ? `On orders above ₹${config.delivery.freeAbove}`
                : 'Fresh bakery treats delivered to your door'}
            </p>
            <Link to="/menu" className="mt-3 inline-flex items-center gap-1 rounded-full bg-terracotta px-4 py-2 text-[11px] font-semibold text-dark transition hover:brightness-95">
              Order now <ArrowRight size={13} />
            </Link>
          </div>
          <div className="absolute -bottom-8 -right-3 flex h-36 w-36 items-center justify-center rounded-full bg-[#fff4c5] sm:right-6 sm:h-40 sm:w-40">
            <span className="text-6xl sm:text-7xl" aria-hidden="true">🥐</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">Categories</h2>
          <Link to="/menu" className="text-xs font-medium text-muted transition hover:text-dark">See all</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-transparent bg-white px-3.5 py-2 text-xs font-medium text-dark shadow-sm transition hover:border-terracotta/50 active:scale-[0.97] sm:text-sm"
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {visibleBestsellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">Bestsellers</h2>
              <p className="mt-0.5 text-xs text-muted sm:text-sm">Most loved by our customers</p>
            </div>
            <Link to="/menu" className="flex items-center gap-1 text-xs font-medium text-muted transition hover:text-dark">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleBestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">Popular Right Now</h2>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">Fresh and ready to order</p>
          </div>
          <Link to="/menu" className="flex items-center gap-1 text-xs font-medium text-muted transition hover:text-dark">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-5 text-center text-sm text-muted">No bakery treats match “{searchQuery}”.</p>
        )}
      </section>

      {preOrderCakes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-black/5 bg-white p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-terracotta/25 p-2.5">
                <Gift size={22} className="text-dark" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-dark sm:text-xl">Birthday & Celebration Cakes</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                  Pre-order your cake and we'll have it fresh for your special day. Place orders at least 24 hours in advance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {preOrderCakes.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link to="/menu?category=cakes" className="inline-flex items-center gap-2 text-sm font-semibold text-dark hover:underline">
                Browse all cakes <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            { icon: Truck, title: 'Local Delivery', desc: `Delivered to your village in ${config.delivery.estimatedTime}`, color: 'bg-blue-50 text-blue-600' },
            { icon: Sprout, title: 'Freshly Sourced', desc: 'Made fresh daily by local bakery suppliers', color: 'bg-green-50 text-green-600' },
            { icon: Smartphone, title: 'Easy Ordering', desc: 'Order via WhatsApp — simple, fast, familiar', color: 'bg-amber-50 text-amber-600' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 sm:p-5">
              <div className={`${color} shrink-0 rounded-xl p-2.5`}><Icon size={20} /></div>
              <div>
                <h3 className="text-sm font-semibold text-dark">{title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
