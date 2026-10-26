import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, LocateFixed, LoaderCircle, MapPin, Search, X } from 'lucide-react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

function getAreaName(result) {
  const address = result.address || {};
  const primary =
    address.suburb || address.neighbourhood || address.village || address.town ||
    address.city_district || address.city || address.municipality || address.county ||
    address.state_district || address.state;
  const secondary =
    address.city || address.town || address.village || address.municipality ||
    address.state_district || address.state;
  const names = [primary, secondary].filter((name, index, all) => name && all.indexOf(name) === index);

  return names.length > 0 ? names.slice(0, 2).join(', ') : (result.display_name || '').split(',').slice(0, 2).join(',').trim();
}

function getMapUrl({ lat, lon }) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  const latitudeOffset = 0.008;
  const longitudeOffset = 0.008 / Math.max(Math.cos((latitude * Math.PI) / 180), 0.2);
  const bounds = [
    longitude - longitudeOffset,
    latitude - latitudeOffset,
    longitude + longitudeOffset,
    latitude + latitudeOffset,
  ].join(',');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${latitude},${longitude}`;
}

export default function DeliveryLocationPicker({
  id,
  label = 'Delivery area',
  value,
  coordinates,
  areas = [],
  onChange,
  onCoordinatesChange,
  error,
  required = false,
}) {
  const [searchText, setSearchText] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapPlace, setMapPlace] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  useEffect(() => {
    const query = searchText.trim();
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return undefined;
    }
    if (query.length < 3) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '5',
          'accept-language': 'en',
        });
        const response = await fetch(`${NOMINATIM_URL}/search?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Place search failed');
        setSuggestions(await response.json());
      } catch (searchError) {
        if (searchError.name !== 'AbortError') {
          setSuggestions([]);
          setLocationError('Place search is temporarily unavailable. You can still enter your area manually.');
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 1100);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchText]);

  const applyPlace = (place) => {
    const areaName = getAreaName(place);
    if (!areaName) {
      setLocationError('We could not identify this area. Try a nearby town or locality.');
      return;
    }

    const selectedPlace = {
      name: areaName,
      lat: Number(place.lat),
      lon: Number(place.lon),
    };
    skipSearchRef.current = true;
    setSearchText(areaName);
    setSuggestions([]);
    setLocationError('');
    setMapPlace(selectedPlace);
    onChange(areaName);
    onCoordinatesChange(`${selectedPlace.lat},${selectedPlace.lon}`);
    setMapOpen(true);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not available in this browser. Search for your area instead.');
      return;
    }

    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            lat: String(coords.latitude),
            lon: String(coords.longitude),
            format: 'jsonv2',
            addressdetails: '1',
            'accept-language': 'en',
          });
          const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`);
          if (!response.ok) throw new Error('Could not identify your area');
          const result = await response.json();
          applyPlace({ ...result, lat: coords.latitude, lon: coords.longitude });
        } catch {
          setLocationError('We could not identify a nearby area. Search for your village or locality instead.');
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        const message = geoError.code === 1
          ? 'Location permission was denied. Search for your village or locality instead.'
          : geoError.code === 2
            ? 'Your location could not be determined. Search for your area instead.'
            : 'Location timed out. Please try again or search for your area.';
        setLocationError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    skipSearchRef.current = false;
    setSearchText(nextValue);
    setSuggestions([]);
    setLocationError('');
    setMapPlace(null);
    if (coordinates) onCoordinatesChange('');
    onChange(nextValue);
  };

  const matchingAreas = areas.filter((area) =>
    area.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  return (
    <div data-error={!!error}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative">
        <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0 || matchingAreas.length > 0}
          aria-controls={`${id}-suggestions`}
          value={searchText}
          onChange={handleSearchChange}
          onFocus={() => setLocationError('')}
          placeholder="Type your village, town or area"
          autoComplete="address-level2"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-dark outline-none transition focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-peach/30 focus:border-terracotta/50 focus:ring-terracotta/20'
          }`}
        />
        {searching ? (
          <LoaderCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted" />
        ) : (
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        )}

        {(suggestions.length > 0 || (searchText.trim().length > 0 && matchingAreas.length > 0)) && (
          <ul
            id={`${id}-suggestions`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-black/10 bg-white p-1 shadow-xl"
          >
            {suggestions.map((place) => (
              <li key={place.place_id} role="option" aria-selected="false">
                <button
                  type="button"
                  onClick={() => applyPlace(place)}
                  className="flex min-h-12 w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm text-dark transition hover:bg-cream"
                >
                  <MapPin size={15} className="mt-0.5 shrink-0 text-terracotta" />
                  <span className="min-w-0">
                    <span className="block font-semibold">{getAreaName(place)}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{place.display_name}</span>
                  </span>
                </button>
              </li>
            ))}
            {matchingAreas.map((area) => (
              <li key={area}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchText(area);
                    onChange(area);
                    onCoordinatesChange('');
                    setSuggestions([]);
                  }}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-dark transition hover:bg-cream"
                >
                  <MapPin size={15} className="shrink-0 text-terracotta" />
                  {area}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs text-red-500">{error}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          aria-live="polite"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm font-semibold text-dark transition-colors hover:bg-terracotta/20 disabled:cursor-wait disabled:opacity-60"
        >
          {locating ? <LoaderCircle size={16} className="animate-spin" /> : <LocateFixed size={16} />}
          {locating ? 'Finding your area…' : 'Use my current location'}
        </button>
        {coordinates && mapPlace && (
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-dark transition-colors hover:bg-cream"
          >
            <MapPin size={15} /> View map
          </button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted">Choose a suggested place or use your location. Your exact pin is shared with the bakery to help with delivery.</p>
      {locationError && <p role="status" className="mt-2 text-xs text-red-600" aria-live="polite">{locationError}</p>}

      {mapOpen && mapPlace && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMapOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-map-title`}
            className="w-full max-w-xl animate-fade-in overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
                  <MapPin size={19} />
                </span>
                <div className="min-w-0">
                  <h2 id={`${id}-map-title`} className="text-base font-bold text-dark">Confirm your delivery area</h2>
                  <p className="mt-0.5 truncate text-sm text-muted">{mapPlace.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-cream hover:text-dark"
                aria-label="Close map"
              >
                <X size={19} />
              </button>
            </div>
            <div className="relative h-[min(52vh,360px)] min-h-[240px] bg-cream sm:h-[360px]">
              <iframe
                title={`Map showing ${mapPlace.name}`}
                src={getMapUrl(mapPlace)}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <a
                href={`https://www.openstreetmap.org/?mlat=${mapPlace.lat}&mlon=${mapPlace.lon}#map=16/${mapPlace.lat}/${mapPlace.lon}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted transition hover:bg-cream hover:text-dark"
              >
                <ExternalLink size={15} /> Open map
              </a>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-terracotta px-5 text-sm font-bold text-dark transition hover:brightness-95"
              >
                <Check size={16} /> Use this location
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
