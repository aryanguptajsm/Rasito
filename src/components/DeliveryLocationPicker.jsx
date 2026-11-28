import { useEffect, useState } from 'react';
import { LoaderCircle, MapPin, Search } from 'lucide-react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

function getAreaName(place) {
  const address = place.address || {};
  return (
    address.village ||
    address.hamlet ||
    address.suburb ||
    address.neighbourhood ||
    address.town ||
    address.city ||
    address.county ||
    place.name ||
    place.display_name?.split(',')[0] ||
    ''
  ).trim();
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
  const [suggestionError, setSuggestionError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  useEffect(() => {
    const query = searchText.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearching(false);
      setSuggestionError('');
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      setSuggestionError('');
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'in',
          'accept-language': 'en',
        });
        const response = await fetch(`${NOMINATIM_URL}/search?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Location suggestions are unavailable.');
        setSuggestions(await response.json());
      } catch (searchError) {
        if (searchError.name !== 'AbortError') {
          setSuggestions([]);
          setSuggestionError('Suggestions are unavailable right now. You can still type your location.');
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchText]);

  const filteredAreas = areas.filter((area) =>
    area.toLowerCase().includes(searchText.trim().toLowerCase())
  );
  const showSuggestions =
    menuOpen &&
    searchText.trim().length > 0 &&
    (suggestions.length > 0 || filteredAreas.length > 0);

  const updateLocation = (nextValue) => {
    setSearchText(nextValue);
    setMenuOpen(true);
    setSuggestionError('');
    if (coordinates) onCoordinatesChange('');
    onChange(nextValue);
  };

  const selectArea = (area) => {
    setSearchText(area);
    setSuggestions([]);
    setMenuOpen(false);
    onCoordinatesChange('');
    onChange(area);
  };

  const selectPlace = (place) => {
    const areaName = getAreaName(place);
    if (!areaName) return;
    setSearchText(areaName);
    setSuggestions([]);
    setMenuOpen(false);
    setSuggestionError('');
    onChange(areaName);
    onCoordinatesChange(`${Number(place.lat)},${Number(place.lon)}`);
  };

  return (
    <div data-error={!!error}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative">
        <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={`${id}-suggestions`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          value={searchText}
          onChange={(event) => updateLocation(event.target.value)}
          onFocus={() => setMenuOpen(true)}
          onBlur={() => window.setTimeout(() => setMenuOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              setMenuOpen(false);
            }
            if (event.key === 'Escape') setMenuOpen(false);
          }}
          placeholder="Type your village, town or area"
          autoComplete="address-level2"
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

        {showSuggestions && (suggestions.length > 0 || filteredAreas.length > 0) && (
          <ul
            id={`${id}-suggestions`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-black/10 bg-white p-1 shadow-xl"
          >
            {suggestions.map((place) => (
              <li key={place.place_id} role="option" aria-selected="false">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectPlace(place)}
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
            {filteredAreas.map((area) => (
              <li key={area}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectArea(area)}
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
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-500">{error}</p>}
      <p className="mt-1.5 text-xs text-muted">Type your location and press Enter, or choose a suggestion. You can enter an unlisted area too.</p>
      {suggestionError && <p role="status" className="mt-1 text-xs text-muted">{suggestionError}</p>}
    </div>
  );
}
