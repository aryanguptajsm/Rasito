import { useRef, useState, useEffect } from 'react';

export default function CategoryChips({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-1 snap-x"
        role="tablist"
        aria-label="Product categories"
      >
        <button
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => onSelect(null)}
          className={`shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap min-h-[36px] ${
            !activeCategory
              ? 'bg-terracotta text-white shadow-sm'
              : 'bg-cream text-muted hover:bg-peach/60 hover:text-chocolate'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap min-h-[36px] ${
              activeCategory === cat.id
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-cream text-muted hover:bg-peach/60 hover:text-chocolate'
            }`}
          >
            <span className="text-base">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
