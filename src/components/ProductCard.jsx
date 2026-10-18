import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#F6E2D3"/>
  <text x="200" y="140" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#C76D45">🧁</text>
  <text x="200" y="180" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#81766E">Image coming soon</text>
</svg>`);

export default function ProductCard({ product, compact = false }) {
  const { addItem, removeItem, getItemQuantity, updateQuantity } = useCart();
  const [imgError, setImgError] = useState(false);
  const quantity = getItemQuantity(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available) return;
    addItem(product);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group block bg-white rounded-[20px] border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        !product.available ? 'opacity-60' : ''
      } ${compact ? '' : ''}`}
      aria-label={`${product.name}, ₹${product.price}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={imgError ? FALLBACK_IMAGE : product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
            <span className="bg-white/90 text-dark text-xs font-semibold px-3 py-1 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}
        {discountPercent && (
              <span className="absolute top-2 left-2 bg-terracotta text-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
        {product.isVeg && (
          <span className="absolute top-2 right-2 bg-green-600/90 text-white p-1 rounded-full" title="Vegetarian">
            <Leaf size={10} />
          </span>
        )}
        {product.isPreOrder && product.available && (
          <span className="absolute bottom-2 left-2 bg-chocolate/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            Pre-order
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-dark text-sm leading-tight line-clamp-1 group-hover:text-terracotta transition-colors">
          {product.name}
        </h3>
        {!compact && (
          <p className="text-muted text-xs mt-0.5 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-chocolate text-base">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted text-xs line-through">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Add to cart / quantity controls */}
          {product.available && (
            <div className="shrink-0" onClick={(e) => e.preventDefault()}>
              {quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1 bg-terracotta text-dark text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-terracotta/90 active:scale-95 transition-all min-h-[32px]"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <Plus size={14} />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="flex items-center gap-0 bg-terracotta rounded-full overflow-hidden min-h-[32px]">
                  <button
                    onClick={handleDecrement}
                    className="text-dark px-2 py-1.5 hover:bg-terracotta/80 active:scale-95 transition-all"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-dark text-xs font-bold min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="text-dark px-2 py-1.5 hover:bg-terracotta/80 active:scale-95 transition-all"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
