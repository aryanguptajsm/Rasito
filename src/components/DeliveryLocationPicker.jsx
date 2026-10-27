import { useEffect, useRef, useState } from 'react';
import { Check, LocateFixed, LoaderCircle, MapPin, Minus, Plus, Search, X } from 'lucide-react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const TILE_SIZE = 256;
const MAX_MERCATOR_LATITUDE = 85.05112878;

function getAreaName(result) {
  const address = result.address || {};
  const village = address.village || address.hamlet || address.isolated_dwelling;
  const locality =
    address.suburb || address.neighbourhood || address.quarter || address.locality ||
    address.town || address.city_district || address.municipality || address.city;
  const district = address.county || address.state_district;
  const names = [village, locality, district]
    .filter((name, index, all) => name && all.indexOf(name) === index);

  return names.length > 0
    ? names.join(', ')
    : (result.display_name || '').split(',').slice(0, 3).map((part) => part.trim()).filter(Boolean).join(', ');
}

function coordinatesToWorld({ lat, lon }, zoom) {
  const scale = TILE_SIZE * (2 ** zoom);
  const latitude = Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, Number(lat)));
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);

  return {
    x: ((Number(lon) + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function worldToCoordinates({ x, y }, zoom) {
  const scale = TILE_SIZE * (2 ** zoom);
  const wrappedX = ((x % scale) + scale) % scale;
  const latitude = (180 / Math.PI) * Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale)));

  return {
    lat: Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, latitude)),
    lon: (wrappedX / scale) * 360 - 180,
  };
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
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(16);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [mapSearching, setMapSearching] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const mapRef = useRef(null);
  const dragRef = useRef(null);
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
    setMapCenter({ lat: selectedPlace.lat, lon: selectedPlace.lon });
    onChange(areaName);
    onCoordinatesChange(`${selectedPlace.lat},${selectedPlace.lon}`);
    setMapOpen(true);
  };

  const lookupCoordinates = async (coordinates) => {
    const params = new URLSearchParams({
      lat: String(coordinates.lat),
      lon: String(coordinates.lon),
      format: 'jsonv2',
      addressdetails: '1',
      'accept-language': 'en',
    });
    const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`);
    if (!response.ok) throw new Error('Could not identify this location');
    const result = await response.json();
    const areaName = getAreaName(result);
    if (!areaName) throw new Error('Could not identify this area');
    return { name: areaName, lat: coordinates.lat, lon: coordinates.lon };
  };

  const confirmMapCenter = async (closeAfterConfirm = false) => {
    if (!mapCenter) return;
    setMapSearching(true);
    setLocationError('');
    try {
      const selectedPlace = await lookupCoordinates(mapCenter);
      setMapPlace(selectedPlace);
      setSearchText(selectedPlace.name);
      onChange(selectedPlace.name);
      onCoordinatesChange(`${selectedPlace.lat},${selectedPlace.lon}`);
      if (closeAfterConfirm) setMapOpen(false);
    } catch {
      setLocationError('We could not identify this spot. Move the map to a nearby street and try again.');
    } finally {
      setMapSearching(false);
    }
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
          const selectedPlace = await lookupCoordinates({ lat: coords.latitude, lon: coords.longitude });
          setMapPlace(selectedPlace);
          setMapCenter({ lat: selectedPlace.lat, lon: selectedPlace.lon });
          setSearchText(selectedPlace.name);
          onChange(selectedPlace.name);
          onCoordinatesChange(`${selectedPlace.lat},${selectedPlace.lon}`);
          setMapOpen(true);
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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const handleSearchChange = (event, preserveMap = false) => {
    const nextValue = event.target.value;
    skipSearchRef.current = false;
    setSearchText(nextValue);
    setSuggestions([]);
    setLocationError('');
    if (!preserveMap) setMapPlace(null);
    if (coordinates) onCoordinatesChange('');
    onChange(nextValue);
  };

  const matchingAreas = areas.filter((area) =>
    area.toLowerCase().includes(searchText.trim().toLowerCase())
  );
  const mapWorldCenter = mapCenter ? coordinatesToWorld(mapCenter, mapZoom) : null;
  const firstTileX = mapWorldCenter ? Math.floor(mapWorldCenter.x / TILE_SIZE) : 0;
  const firstTileY = mapWorldCenter ? Math.floor(mapWorldCenter.y / TILE_SIZE) : 0;
  const worldSize = TILE_SIZE * (2 ** mapZoom);

  useEffect(() => {
    if (!mapOpen || !mapRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setMapSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, [mapOpen]);

  const handleMapPointerDown = (event) => {
    if (event.button !== 0 || !mapCenter) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      world: coordinatesToWorld(mapCenter, mapZoom),
    };
  };

  const handleMapPointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    const drag = dragRef.current;
    setMapCenter(worldToCoordinates({
      x: drag.world.x - (event.clientX - drag.x),
      y: Math.max(0, Math.min(worldSize, drag.world.y - (event.clientY - drag.y))),
    }, mapZoom));
  };

  const handleMapPointerUp = async (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    await confirmMapCenter();
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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMapOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-map-title`}
            className="flex h-[min(90dvh,760px)] w-full max-w-2xl animate-slide-up flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[min(86vh,760px)] sm:rounded-[28px]"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta/15 text-terracotta">
                  <MapPin size={19} />
                </span>
                <div className="min-w-0">
                  <h2 id={`${id}-map-title`} className="text-lg font-bold text-dark">Pin your delivery spot</h2>
                  <p className="mt-0.5 truncate text-sm text-muted">Move the map to place the pin exactly</p>
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
            <div className="relative z-10 px-4 pb-3 sm:px-6">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => handleSearchChange(event, true)}
                  placeholder="Search by area, name, street"
                  aria-label="Search for a place on the map"
                  className="w-full rounded-2xl border border-black/5 bg-white py-3.5 pl-11 pr-4 text-sm text-dark shadow-lg outline-none transition focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full mt-2 max-h-52 overflow-auto rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl">
                    {suggestions.map((place) => (
                      <li key={place.place_id}>
                        <button
                          type="button"
                          onClick={() => applyPlace(place)}
                          className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cream"
                        >
                          <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta" />
                          <span className="min-w-0">
                            <span className="block font-semibold text-dark">{getAreaName(place)}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted">{place.display_name}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div
              ref={mapRef}
              className="relative min-h-0 flex-1 touch-none cursor-grab overflow-hidden bg-[#e8edf0] active:cursor-grabbing"
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerCancel={handleMapPointerUp}
              aria-label="Move the map to adjust the delivery pin"
              role="application"
            >
              {mapWorldCenter && mapSize.width > 0 && Array.from({ length: 25 }, (_, index) => {
                const offsetX = (index % 5) - 2;
                const offsetY = Math.floor(index / 5) - 2;
                const tileX = firstTileX + offsetX;
                const tileY = firstTileY + offsetY;
                const wrappedTileX = ((tileX % (2 ** mapZoom)) + (2 ** mapZoom)) % (2 ** mapZoom);
                if (tileY < 0 || tileY >= 2 ** mapZoom) return null;
                return (
                  <img
                    key={`${mapZoom}-${tileX}-${tileY}`}
                    src={`https://tile.openstreetmap.org/${mapZoom}/${wrappedTileX}/${tileY}.png`}
                    alt=""
                    draggable="false"
                    className="pointer-events-none absolute max-w-none select-none"
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      left: mapSize.width / 2 + tileX * TILE_SIZE - mapWorldCenter.x,
                      top: mapSize.height / 2 + tileY * TILE_SIZE - mapWorldCenter.y,
                    }}
                  />
                );
              })}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-full">
                <span className="absolute -bottom-1 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-terracotta/20 animate-ping" />
                <MapPin size={46} fill="#F7CE27" stroke="#20211D" strokeWidth={2.2} className="relative drop-shadow-[0_4px_5px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute bottom-3 right-3 z-[2] flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg">
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setMapZoom((zoom) => Math.min(19, zoom + 1))}
                  disabled={mapZoom >= 19}
                  aria-label="Zoom in"
                  className="flex h-11 w-11 items-center justify-center text-dark transition hover:bg-cream disabled:opacity-40"
                >
                  <Plus size={19} />
                </button>
                <span className="h-px bg-black/10" />
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setMapZoom((zoom) => Math.max(3, zoom - 1))}
                  disabled={mapZoom <= 3}
                  aria-label="Zoom out"
                  className="flex h-11 w-11 items-center justify-center text-dark transition hover:bg-cream disabled:opacity-40"
                >
                  <Minus size={19} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 z-[2] rounded-lg bg-white/90 px-2 py-1 text-[10px] text-muted shadow-sm">
                © OpenStreetMap contributors
              </div>
            </div>
            <div className="relative z-[2] rounded-t-3xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:px-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Deliver to</span>
                  <span className="mt-1 block truncate text-base font-bold text-dark">{mapPlace.name}</span>
                </div>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={locating}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-terracotta/10 px-3 text-xs font-bold text-dark transition hover:bg-terracotta/20 disabled:opacity-60"
                >
                  {locating ? <LoaderCircle size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                  {locating ? 'Locating…' : 'Current location'}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs text-muted">
                  {mapCenter?.lat.toFixed(5)}, {mapCenter?.lon.toFixed(5)}
                </p>
                <button
                  type="button"
                  onClick={() => confirmMapCenter(true)}
                  disabled={mapSearching || locating}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-terracotta px-5 text-sm font-bold text-dark shadow-md shadow-terracotta/25 transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
                >
                  {mapSearching ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}
                  {mapSearching ? 'Finding address…' : 'Confirm location'}
                </button>
              </div>
              {locationError && <p role="status" className="mt-2 text-xs text-red-600" aria-live="polite">{locationError}</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
