/* =============================================
   map_explore.js — Pravas Map Explore Screen
   Backend connected: GET /api/maps/nearby
                      GET /api/maps/search
                      GET /api/maps/offline-tile
   ============================================= */

/* ── Tailwind Config ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed":                "#dae2ff",
        "background":                   "#f6fafe",
        "surface-dim":                  "#d6dade",
        "secondary":                    "#48626e",
        "on-surface":                   "#171c1f",
        "tertiary":                     "#602400",
        "tertiary-fixed":               "#ffdbcb",
        "primary":                      "#00327d",
        "on-tertiary-fixed":            "#341100",
        "surface-bright":               "#f6fafe",
        "on-secondary-container":       "#4e6874",
        "secondary-fixed":              "#cbe7f5",
        "surface-tint":                 "#2559bd",
        "on-primary-fixed":             "#001946",
        "primary-fixed-dim":            "#b1c5ff",
        "on-tertiary-fixed-variant":    "#7a3000",
        "on-primary":                   "#ffffff",
        "on-error":                     "#ffffff",
        "primary-container":            "#0047ab",
        "on-secondary-fixed":           "#021f29",
        "surface-container-highest":    "#dfe3e7",
        "surface-container":            "#eaeef2",
        "surface":                      "#f6fafe",
        "inverse-primary":              "#b1c5ff",
        "error-container":              "#ffdad6",
        "tertiary-fixed-dim":           "#ffb692",
        "surface-variant":              "#dfe3e7",
        "on-surface-variant":           "#434653",
        "on-secondary":                 "#ffffff",
        "on-primary-fixed-variant":     "#00419e",
        "on-tertiary":                  "#ffffff",
        "outline":                      "#737784",
        "surface-container-low":        "#f0f4f8",
        "surface-container-high":       "#e4e9ed",
        "error":                        "#ba1a1a",
        "on-tertiary-container":        "#ffaa80",
        "on-primary-container":         "#a5bdff",
        "outline-variant":              "#c3c6d5",
        "secondary-container":          "#cbe7f5",
        "inverse-on-surface":           "#edf1f5",
        "secondary-fixed-dim":          "#afcbd8",
        "surface-container-lowest":     "#ffffff",
        "inverse-surface":              "#2c3134",
        "on-error-container":           "#93000a",
        "on-secondary-fixed-variant":   "#304a55",
        "on-background":                "#171c1f",
        "tertiary-container":           "#843500"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body":     ["Inter"],
        "label":    ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg":      "0.5rem",
        "xl":      "0.75rem",
        "2xl":     "1rem",
        "3xl":     "1.5rem",
        "full":    "9999px"
      }
    }
  }
};

/* ── Config ── */
const API_BASE = 'http://localhost:5000';

/* ── Category chip → Google Places type mapping ── */
const CATEGORY_TYPE_MAP = {
  'Dining':      'restaurant',
  'Sightseeing': 'tourist_attraction',
  'Stays':       'lodging',
  'Markets':     'shopping_mall',
};

/* ── State ── */
let currentLat  = null;
let currentLng  = null;
let activePlace = null;
let zoomLevel   = 14;

/* ── Helpers ── */
function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || null;
}

function showToast(message, type = 'error') {
  const existing = document.getElementById('pravas-toast');
  if (existing) existing.remove();

  const colors = type === 'success' ? 'bg-primary text-white' : 'bg-error text-on-error';
  const icon   = type === 'success' ? 'check_circle' : 'error';

  const toast = document.createElement('div');
  toast.id = 'pravas-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 ${colors}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${icon}</span>${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Get user's current location ── */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => {
        // Fallback: use active trip destination coords from localStorage
        const lat = parseFloat(localStorage.getItem('activeTripLat') || '26.9124');
        const lng = parseFloat(localStorage.getItem('activeTripLng') || '75.7873');
        resolve({ lat, lng });
      }
    );
  });
}

/* ── Fetch nearby places ── */
async function fetchNearby(lat, lng, type = 'tourist_attraction') {
  const token = getToken();
  if (!token) { showToast('Please log in first'); return []; }

  try {
    const res = await fetch(
      `${API_BASE}/api/maps/nearby?lat=${lat}&lng=${lng}&type=${type}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch places');
    return data.places || [];
  } catch (err) {
    console.error('Nearby fetch error:', err);
    showToast(err.message || 'Could not load nearby places');
    return [];
  }
}

/* ── Fetch search results ── */
async function fetchSearch(query) {
  const token = getToken();
  if (!token) { showToast('Please log in first'); return []; }

  try {
    const res = await fetch(
      `${API_BASE}/api/maps/search?query=${encodeURIComponent(query)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Search failed');
    return data.places || [];
  } catch (err) {
    console.error('Search error:', err);
    showToast(err.message || 'Search failed');
    return [];
  }
}

/* ── Fetch offline tile URL and update map image ── */
async function fetchMapTile(lat, lng, zoom = 14) {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(
      `${API_BASE}/api/maps/offline-tile?lat=${lat}&lng=${lng}&zoom=${zoom}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok || !data.tileUrl) return;

    const mapImg = document.querySelector('[data-location]');
    if (mapImg) {
      mapImg.src = data.tileUrl;
      mapImg.alt = `Map view at ${lat}, ${lng}`;
    }
  } catch (err) {
    console.error('Tile fetch error:', err);
  }
}

/* ── Render bottom context card with place data ── */
function renderPlaceCard(place) {
  activePlace = place;

  const nameEl    = document.querySelector('.font-headline.text-2xl.font-extrabold');
  const addressEl = document.querySelector('.text-on-surface-variant.text-sm.flex.items-center');
  const ratingEl  = document.querySelector('.text-xs.font-bold.ml-1');

  if (nameEl)    nameEl.textContent = place.name || '—';
  if (addressEl) addressEl.innerHTML = `<span class="material-symbols-outlined text-sm">location_on</span>${place.address || '—'}`;
  if (ratingEl)  ratingEl.textContent = place.rating ? `${place.rating} ★` : '—';

  // Update distance if we have coords
  if (currentLat && currentLng && place.location) {
    const dist = getDistanceKm(currentLat, currentLng, place.location.lat, place.location.lng);
    const distEl = document.querySelector('.text-primary');
    if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
  }
}

/* ── Render map markers for a list of places ── */
function renderMarkers(places) {
  // Remove old dynamic markers
  document.querySelectorAll('.dynamic-marker').forEach(m => m.remove());

  const mapContainer = document.querySelector('.absolute.inset-0.z-0');
  if (!mapContainer || !places.length) return;

  // Distribute markers across the visible map area (approximation)
  places.slice(0, 5).forEach((place, i) => {
    const tops  = [35, 45, 55, 65, 30];
    const lefts = [45, 60, 30, 50, 70];
    const top   = tops[i]  || (30 + i * 10);
    const left  = lefts[i] || (40 + i * 8);

    const marker = document.createElement('div');
    marker.className = 'absolute group cursor-pointer z-10 dynamic-marker';
    marker.style.top    = `${top}%`;
    marker.style.left   = `${left}%`;
    marker.style.transform = 'translate(-50%, -50%)';

    const isFirst = i === 0;
    marker.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="${isFirst
          ? 'bg-primary text-white'
          : 'bg-white/90 backdrop-blur-md text-primary'
        } px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 mb-2 transform transition-transform group-hover:scale-110">
          <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">place</span>
          <span class="truncate max-w-[120px]">${place.name}</span>
        </div>
        <div class="w-4 h-4 ${isFirst ? 'bg-primary border-white' : 'bg-white border-primary'} border-4 rounded-full shadow-md"></div>
      </div>`;

    marker.addEventListener('click', () => renderPlaceCard(place));
    mapContainer.appendChild(marker);
  });

  // Auto-show first place in card
  if (places[0]) renderPlaceCard(places[0]);
}

/* ── Haversine distance ── */
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Original favourite toggle (preserved) ── */
function toggleFavourite(btn) {
  const icon   = btn.querySelector('.material-symbols-outlined');
  const isSaved = icon.style.fontVariationSettings?.includes("'FILL' 1");
  if (isSaved) {
    icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
    btn.classList.remove('text-error');
  } else {
    icon.style.fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";
    btn.classList.add('text-error');
  }
}

/* ── Map zoom — now also re-fetches tile ── */
function mapZoom(direction) {
  if (direction === 'in'  && zoomLevel < 20) zoomLevel++;
  if (direction === 'out' && zoomLevel > 1)  zoomLevel--;

  // Visual brightness feedback
  const mapImg = document.querySelector('[data-location]');
  if (mapImg) {
    const brightness = 0.9 + (zoomLevel / 20) * 0.3;
    mapImg.style.filter = `grayscale(20%) brightness(${brightness.toFixed(2)})`;
  }

  // Re-fetch tile at new zoom level
  if (currentLat && currentLng) {
    fetchMapTile(currentLat, currentLng, zoomLevel);
  }
}

/* ── Wire up search bar ── */
function wireSearchBar() {
  const input = document.querySelector('input[type="text"]');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) return;
      const places = await fetchSearch(q);
      if (places.length) renderMarkers(places);
    }, 500);
  });

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (!q) return;
      const places = await fetchSearch(q);
      if (places.length) renderMarkers(places);
      else showToast('No results found');
    }
  });
}

/* ── Wire up category chips ── */
function wireCategoryChips() {
  const chipBtns = document.querySelectorAll('.flex.gap-2.mt-4 button');
  chipBtns.forEach(btn => {
    const label = btn.textContent.trim();
    const type  = CATEGORY_TYPE_MAP[label];
    if (!type) return;

    btn.addEventListener('click', async () => {
      // Active state
      chipBtns.forEach(b => b.classList.remove('bg-primary', 'text-white'));
      btn.classList.add('bg-primary', 'text-white');

      if (currentLat && currentLng) {
        const places = await fetchNearby(currentLat, currentLng, type);
        if (places.length) renderMarkers(places);
        else showToast(`No ${label.toLowerCase()} found nearby`);
      }
    });
  });
}

/* ── Init on page load ── */
document.addEventListener('DOMContentLoaded', async () => {
  // Get location first
  try {
    const pos = await getUserLocation();
    currentLat = pos.lat;
    currentLng = pos.lng;
  } catch (e) {
    currentLat = 26.9124; // Jaipur fallback
    currentLng = 75.7873;
  }

  // Load map tile
  fetchMapTile(currentLat, currentLng, zoomLevel);

  // Load default nearby (tourist attractions)
  const places = await fetchNearby(currentLat, currentLng, 'tourist_attraction');
  if (places.length) renderMarkers(places);

  // Wire up interactions
  wireSearchBar();
  wireCategoryChips();
});