import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, Home, MessageSquare, CreditCard, Clock, AlertCircle,
  Send, ChevronDown, Info, CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { configService, whatsappService, orderService } from '../services/dataService';
import config from '../data/config';

function InputField({
  icon: Icon,
  label,
  type = 'text',
  placeholder,
  required = false,
  rows,
  suggestions = [],
  value,
  error,
  onChange,
}) {
  return (
    <div data-error={!!error}>
      <label className="block text-sm font-medium text-dark mb-1.5">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        )}
        {rows ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border rounded-xl text-sm text-dark bg-white resize-none focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-300 focus:ring-red-200'
                : 'border-peach/30 focus:ring-terracotta/20 focus:border-terracotta/50'
            }`}
          />
        ) : (
          <>
            <input
              type={type}
              value={value}
              onChange={onChange}
              list={suggestions.length > 0 ? 'delivery-address-suggestions' : undefined}
              placeholder={placeholder}
              inputMode={type === 'tel' ? 'numeric' : undefined}
              maxLength={type === 'tel' ? 10 : undefined}
              autoComplete={type === 'tel' ? 'tel' : undefined}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border rounded-xl text-sm text-dark bg-white focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-peach/30 focus:ring-terracotta/20 focus:border-terracotta/50'
              }`}
            />
            {suggestions.length > 0 && (
              <datalist id="delivery-address-suggestions">
                {suggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = configService.getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const paymentOptions = configService.getPaymentOptions();
  const deliveryAreas = configService.getDeliveryAreas();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    village: '',
    address: '',
    landmark: '',
    instructions: '',
    paymentMethod: paymentOptions[0]?.label || '',
    orderNotes: '',
    deliveryDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Redirect if cart is empty
  if (itemCount === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-4xl mb-3">🛒</div>
        <h2 className="text-xl font-bold text-dark mb-2">Nothing to checkout</h2>
        <p className="text-sm text-muted mb-4">Add items to your cart first.</p>
        <Link to="/menu" className="text-terracotta font-medium hover:underline">
          ← Browse Menu
        </Link>
      </div>
    );
  }

  // Order placed success state
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto">
        <div className="bg-green-50 p-5 rounded-full mb-5">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Order Sent! 🎉</h2>
        <p className="text-sm text-muted mb-3 leading-relaxed">
          Your order <strong className="text-chocolate">{orderId}</strong> has been sent via WhatsApp.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              {config.orderConfirmationNote}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Link
            to="/orders"
            className="w-full bg-terracotta text-white font-semibold py-3 rounded-xl hover:bg-terracotta/90 transition-all text-center"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="w-full text-terracotta font-medium py-2 text-center hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!form.village.trim()) errs.village = 'Village/locality is required';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    return errs;
  };

  const handleChange = (field) => (e) => {
    const value = field === 'phone'
      ? e.target.value.replace(/\D/g, '').slice(0, 10)
      : e.target.value;
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (errors[field]) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    try {
      // Generate WhatsApp message
      const message = whatsappService.generateMessage({
        items,
        subtotal,
        deliveryFee,
        total,
        customer: form,
      });

      // Save order locally
      const order = await orderService.create({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        customer: {
          name: form.name,
          phone: form.phone,
          village: form.village,
          address: form.address,
          landmark: form.landmark,
          instructions: form.instructions,
          paymentMethod: form.paymentMethod,
          orderNotes: form.orderNotes,
          deliveryDate: form.deliveryDate,
        },
      });

      // Try to open WhatsApp
      const result = whatsappService.openWhatsApp(message);

      if (!result.success) {
        // WhatsApp not configured — still save order, show the error
        alert(result.error);
      }

      setOrderId(order.id);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasPreOrderItems = items.some((item) => item.isPreOrder);

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-dark transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">Checkout</h1>
          <p className="text-xs text-muted">{itemCount} items · ₹{total}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Form Section */}
          <div className="md:col-span-3 space-y-5">
            {/* Customer Details */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-dark flex items-center gap-2">
                <User size={16} className="text-terracotta" />
                Your Details
              </h2>
              <InputField
                icon={User}
                label="Full Name"
                value={form.name}
                error={errors.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                required
              />
              <InputField
                icon={Phone}
                label="Mobile Number"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={handleChange('phone')}
                placeholder="10-digit mobile number"
                required
              />
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-dark flex items-center gap-2">
                <MapPin size={16} className="text-terracotta" />
                Delivery Address
              </h2>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Village / Locality <span className="text-terracotta">*</span>
                </label>
                <select
                  value={form.village}
                  onChange={handleChange('village')}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm text-dark bg-white appearance-none focus:outline-none focus:ring-2 transition-all ${
                    errors.village
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-peach/30 focus:ring-terracotta/20 focus:border-terracotta/50'
                  }`}
                >
                  <option value="">Select your area</option>
                  {deliveryAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {errors.village && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.village}
                  </p>
                )}
              </div>
              <InputField
                icon={Home}
                label="Full Address"
                value={form.address}
                error={errors.address}
                onChange={handleChange('address')}
                placeholder="Le Uncholia Shiv Mandir Gali"
                suggestions={['Le Uncholia Shiv Mandir Gali']}
                required
              />
              <InputField
                icon={MapPin}
                label="Landmark"
                value={form.landmark}
                error={errors.landmark}
                onChange={handleChange('landmark')}
                placeholder="Near temple, school, etc. (optional)"
              />
              <InputField
                label="Delivery Instructions"
                value={form.instructions}
                error={errors.instructions}
                onChange={handleChange('instructions')}
                placeholder="Ring the bell twice, call on arrival, etc."
                rows={2}
              />
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-dark flex items-center gap-2">
                <CreditCard size={16} className="text-terracotta" />
                Payment
              </h2>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === opt.label
                        ? 'border-terracotta bg-terracotta/5'
                        : 'border-peach/30 hover:bg-cream'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.label}
                      checked={form.paymentMethod === opt.label}
                      onChange={handleChange('paymentMethod')}
                      className="accent-terracotta"
                    />
                    <span className="text-sm text-dark">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pre-order date */}
            {hasPreOrderItems && (
              <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm space-y-4">
                <h2 className="font-semibold text-dark flex items-center gap-2">
                  <Clock size={16} className="text-terracotta" />
                  Preferred Delivery Date
                </h2>
                <p className="text-xs text-muted">
                  Your cart has pre-order items (cakes). Please select your preferred delivery date.
                </p>
                <input
                  type="date"
                  value={form.deliveryDate}
                  min={
                    new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  }
                  onChange={handleChange('deliveryDate')}
                  className="w-full px-3 py-2.5 border border-peach/30 rounded-xl text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                />
              </div>
            )}

            {/* Order notes */}
            <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm">
              <InputField
                icon={MessageSquare}
                label="Order Notes"
                value={form.orderNotes}
                error={errors.orderNotes}
                onChange={handleChange('orderNotes')}
                placeholder="Any special requests or notes"
                rows={2}
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-20 space-y-4">
              <div className="bg-white rounded-xl border border-peach/20 p-4 sm:p-5 shadow-sm">
                <h2 className="font-semibold text-dark mb-3">Order Summary</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted truncate pr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-dark font-medium shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-peach/20 pt-2 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-dark">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : 'text-dark'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t border-peach/20 pt-2 flex justify-between">
                    <span className="font-semibold text-dark">Total</span>
                    <span className="font-bold text-lg text-chocolate">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-cream/50 rounded-xl p-4 text-xs text-muted space-y-2">
                <p className="flex items-center gap-1.5">
                  <Clock size={12} className="text-terracotta" />
                  Estimated delivery: {config.delivery.estimatedTime}
                </p>
                <p className="flex items-start gap-1.5">
                  <Info size={12} className="text-terracotta shrink-0 mt-0.5" />
                  {config.cancellationPolicy}
                </p>
              </div>

              {/* WhatsApp notice */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-xs text-green-700">
                <p className="flex items-start gap-1.5">
                  <Send size={12} className="shrink-0 mt-0.5" />
                  Your order will be sent via WhatsApp.{' '}
                  {config.orderConfirmationNote.split('.')[0]}.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send size={18} />
                    Send Order via WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
