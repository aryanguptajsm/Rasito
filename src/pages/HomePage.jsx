import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Sprout, Smartphone, ChevronRight } from 'lucide-react';
import { productService } from '../services/dataService';
import { CATEGORIES } from '../data/products';
import config from '../data/config';
import ProductCard from '../components/ProductCard';

export default function HomePage({ searchQuery = '' }) {
  const [bestsellers, setBestsellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getBestsellers().then(setBestsellers);
    productService.getAll().then(setAllProducts);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (product) =>
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
  const visibleProducts = query ? allProducts.filter(matchesQuery) : allProducts;
  const visibleBestsellers = query ? bestsellers.filter(matchesQuery) : bestsellers;
  const visibleCakes = visibleProducts.filter((product) => product.category === 'cakes');
  const visibleTreats = visibleProducts.filter((product) => product.category !== 'cakes');
  const fourHundredRupeeCakeCount = visibleCakes.filter((product) => product.price === 400).length;

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b6b16]">Fresh from the bakery</p>
            <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">Today’s Offers</h2>
          </div>
          <Link to="/menu" className="text-xs font-medium text-muted transition hover:text-dark">See all</Link>
        </div>
        <div className="relative flex min-h-[164px] items-center justify-between overflow-hidden rounded-[28px] border border-[#f1dfc4] bg-gradient-to-br from-[#fff8e9] via-white to-[#fff0ee] p-4 shadow-sm sm:min-h-[190px] sm:px-7">
          <div className="relative z-10 max-w-[66%]">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9b6b16] shadow-sm">
              <Truck size={13} />
              Today’s special
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-dark sm:text-2xl">A little treat, on us!</h3>
            <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-muted sm:text-sm">
              {config.delivery.freeAbove
                ? `Get free delivery on orders of ₹${config.delivery.freeAbove} or more. Happy cravings!`
                : 'Fresh bakery treats delivered to your door'}
            </p>
            <Link to="/menu" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#24211e] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#40352e]">
              Explore treats <ArrowRight size={13} />
            </Link>
          </div>
          <div className="pointer-events-none absolute -right-1 bottom-0 h-full w-[40%]" aria-hidden="true">
            <span className="absolute right-[25%] top-[12%] flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-[18px] border-2 border-white bg-[#ffe1da] text-3xl shadow-md sm:h-[68px] sm:w-[68px] sm:text-4xl">🧁</span>
            <span className="absolute right-[8%] top-[42%] flex h-16 w-16 rotate-[9deg] items-center justify-center rounded-full border-2 border-white bg-[#fff0b8] text-4xl shadow-md sm:h-[76px] sm:w-[76px] sm:text-5xl">🎂</span>
            <span className="absolute bottom-[8%] right-[46%] flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-[16px] border-2 border-white bg-[#e8f0d7] text-2xl shadow-md sm:h-14 sm:w-14 sm:text-3xl">🥐</span>
            <span className="absolute right-[48%] top-[18%] text-xl sm:text-2xl">🍪</span>
            <span className="absolute bottom-[7%] right-[2%] text-xl sm:text-2xl">✨</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-3 pt-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">🎂</span>
              <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">All Cakes</h2>
            </div>
            <p className="text-xs text-muted sm:text-sm">
              {visibleCakes.length} celebration-ready cakes{fourHundredRupeeCakeCount > 0 ? ` · ${fourHundredRupeeCakeCount} at ₹400` : ''}
            </p>
          </div>
          <Link to="/menu?category=cakes" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#9b6b16] transition hover:text-dark">
            Browse cakes <ChevronRight size={14} />
          </Link>
        </div>
        {visibleCakes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleCakes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-5 text-center text-sm text-muted">No cakes match “{searchQuery}”.</p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">A treat for every mood</h2>
            <p className="mt-0.5 text-xs text-muted">Cakes, pastries, snacks & more</p>
          </div>
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

      {visibleTreats.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-dark sm:text-xl">More bakery favourites</h2>
              <p className="mt-0.5 text-xs text-muted sm:text-sm">Fresh pastries, snacks and little bites</p>
            </div>
            <Link to="/menu" className="flex items-center gap-1 text-xs font-medium text-muted transition hover:text-dark">
              View menu <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleTreats.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

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
