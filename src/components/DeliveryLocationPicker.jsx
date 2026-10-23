import { useState } from 'react';
import { LocateFixed, MapPin, X } from 'lucide-react';

export default function DeliveryLocationPicker({
  id,
  label = 'Delivery area',
  value,
  coordinates,
  areas,
  onChange,
  onCoordinatesChange,
  error,
  required = false,
}) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not available in this browser.');
      return;
    }

    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onCoordinatesChange(`${coords.latitude},${coords.longitude}`);
        setLocating(false);
      },
      (geoError) => {
        const message = geoError.code === 1
          ? 'Location permission was denied. You can still enter your area above.'
          : geoError.code === 2
            ? 'Your location could not be determined. Please enter your area above.'
            : 'Location timed out. Please try again or enter your area above.';
        setLocationError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  return (
    <div data-error={!!error}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative">
        <MapPin
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id={id}
          type="text"
          list={`${id}-suggestions`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search or enter your village / locality"
          autoComplete="address-level2"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-dark outline-none transition focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-peach/30 focus:border-terracotta/50 focus:ring-terracotta/20'
          }`}
        />
        <datalist id={`${id}-suggestions`}>
          {areas.map((area) => <option key={area} value={area} />)}
        </datalist>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        aria-live="polite"
        className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm font-semibold text-dark transition-colors hover:bg-terracotta/20 disabled:cursor-wait disabled:opacity-60"
      >
        <LocateFixed size={16} className={locating ? 'animate-pulse' : ''} />
        {locating ? 'Finding location…' : 'Use my current location'}
      </button>

      {coordinates && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-cream px-3 py-2 text-xs text-muted">
          <span>
            GPS pin saved: {Number(coordinates.split(',')[0]).toFixed(5)},{' '}
            {Number(coordinates.split(',')[1]).toFixed(5)}
          </span>
          <button
            type="button"
            onClick={() => onCoordinatesChange('')}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-medium text-dark hover:bg-white"
            aria-label="Remove GPS pin"
          >
            <X size={13} />
            Remove
          </button>
        </div>
      )}
      {locationError && (
        <p role="status" className="mt-2 text-xs text-red-600" aria-live="polite">
          {locationError}
        </p>
      )}
    </div>
  );
}
