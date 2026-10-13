import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, PackageOpen } from 'lucide-react';
import { productService } from '../services/dataService';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import CategoryChips from '../components/CategoryChips';

const SORT_OPTIONS = [
  { id: 'default', label: 'Recommended' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name-az', label: 'Name: A–Z' },
];

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    productService.getAllIncludingUnavailable().then(setProducts);
  }, []);

  // Update category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Filter and sort
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Available first, then bestsellers first
        result.sort((a, b) => {
          if (a.available !== b.available) return a.available ? -1 : 1;
          if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
          return 0;
        });
    }

    setFiltered(result);
  }, [products, activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  const activeCategoryLabel = activeCategory
    ? CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory
    : 'All';

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark">Our Menu</h1>
        <p className="text-sm text-muted mt-1">Browse and order your favorite bakery items</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-peach/30 rounded-xl text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark p-1"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Chips */}
      <div className="mb-4">
        <CategoryChips
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      {/* Sort & Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {activeCategory ? ` in ${activeCategoryLabel}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-chocolate px-3 py-1.5 rounded-lg border border-peach/30 hover:bg-cream transition-colors"
          >
            <ArrowUpDown size={12} />
            {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Sort'}
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-peach/30 py-1 z-50 min-w-[180px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setShowSort(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors ${
                      sortBy === opt.id ? 'text-terracotta font-medium' : 'text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-cream p-4 rounded-full mb-4">
            <PackageOpen size={40} className="text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-1">No products found</h3>
          <p className="text-sm text-muted max-w-xs">
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}". Try a different search.`
              : `No products available in ${activeCategoryLabel} right now.`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange(null);
            }}
            className="mt-4 text-sm text-terracotta font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
