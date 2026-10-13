import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Sprout, Smartphone, ChevronRight, Cake, Gift } from 'lucide-react';
import { productService } from '../services/dataService';
import { CATEGORIES } from '../data/products';
import config from '../data/config';
import ProductCard from '../components/ProductCard';
import CategoryChips from '../components/CategoryChips';

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [preOrderCakes, setPreOrderCakes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getBestsellers().then(setBestsellers);
    productService.getPreOrderCakes().then(setPreOrderCakes);
    productService.getAll().then(setAllProducts);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream via-white to-peach/30 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-0 w-32 h-32 bg-terracotta/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-peach/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center lg:text-left lg:mx-0">
            {config.isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[11px] text-terracotta bg-terracotta/10 px-3 py-1 rounded-full font-medium mb-4">
                ⚠️ Demo Mode — Sample data for demonstration
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
              {config.tagline.split(',')[0]},
              <span className="text-terracotta block sm:inline">
                {' '}{config.tagline.split(',').slice(1).join(',')}
              </span>
            </h1>
            <p className="mt-4 text-muted text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              {config.subTagline}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                to="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta text-white font-semibold px-6 py-3 rounded-full hover:bg-terracotta/90 active:scale-[0.98] transition-all shadow-lg shadow-terracotta/20"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/menu?category=cakes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-chocolate font-semibold px-6 py-3 rounded-full border border-peach/40 hover:bg-cream transition-all"
              >
                <Cake size={18} />
                Order Cake
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="shrink-0 flex items-center gap-2 bg-white border border-peach/30 px-4 py-2.5 rounded-2xl text-sm font-medium text-chocolate hover:bg-cream hover:border-terracotta/30 transition-all active:scale-[0.97] shadow-sm"
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark">🔥 Bestsellers</h2>
              <p className="text-sm text-muted mt-0.5">Most loved by our customers</p>
            </div>
            <Link
              to="/menu"
              className="text-sm text-terracotta font-medium flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark">✨ Popular Right Now</h2>
            <p className="text-sm text-muted mt-0.5">Fresh and ready to order</p>
          </div>
          <Link
            to="/menu"
            className="text-sm text-terracotta font-medium flex items-center gap-1 hover:underline"
          >
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {allProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      {/* Pre-order Cakes / Birthday Section */}
      {preOrderCakes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-peach/40 via-cream to-peach/20 rounded-3xl p-5 sm:p-8 border border-peach/30">
            <div className="flex items-start gap-3 mb-5">
              <div className="bg-terracotta/10 p-2.5 rounded-xl shrink-0">
                <Gift size={24} className="text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-dark">
                  🎂 Birthday & Celebration Cakes
                </h2>
                <p className="text-sm text-muted mt-1">
                  Pre-order your cake and we'll have it fresh for your special day. Place orders at
                  least 24 hours in advance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {preOrderCakes.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link
                to="/menu?category=cakes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:underline"
              >
                Browse all cakes <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Service Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Truck,
              title: 'Local Delivery',
              desc: `Delivered to your village in ${config.delivery.estimatedTime}`,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: Sprout,
              title: 'Freshly Sourced',
              desc: 'Made fresh daily by local bakery suppliers',
              color: 'bg-green-50 text-green-600',
            },
            {
              icon: Smartphone,
              title: 'Easy Ordering',
              desc: 'Order via WhatsApp — simple, fast, familiar',
              color: 'bg-amber-50 text-amber-600',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-peach/20 shadow-sm"
            >
              <div className={`${color} p-2.5 rounded-xl shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-dark text-sm">{title}</h3>
                <p className="text-muted text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
