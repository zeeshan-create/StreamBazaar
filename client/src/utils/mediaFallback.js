// Media Fallback Utility for StreamBazaar
// Handles priority-based media resolution for Game covers and Brand logos.

// ============================================================================
// API KEYS (PLACEHOLDERS - USER TO REPLACE WITH ACTUAL KEYS)
// ============================================================================
const RAWG_API_KEY = "RAWG_API_KEY_PLACEHOLDER";
const LOGODEV_PUBLISHABLE_KEY = "LOGODEV_PUBLISHABLE_KEY_PLACEHOLDER";
// Note: Brandfetch Secret Key must be set in Vercel environment variables as BRANDFETCH_SECRET_KEY

// ----------------------------------------------------------------------------
// Fallback local placeholders
// ----------------------------------------------------------------------------
export const PLACEHOLDER_GAME = "/placeholder-game.png";
export const PLACEHOLDER_OTT = "/placeholder-ott.png";

// Base API URL
const API_BASE = import.meta.env.PROD ? "" : "http://localhost:5000";

export const getProxiedUrl = (url) => {
  return url || "";
};

/**
 * Searches for a game cover using the Steam Store API.
 * @param {string} query Game title to search.
 * @returns {Promise<string|null>} Resolved cover URL or null.
 */
export async function fetchSteamCover(query) {
  try {
    // Attempting direct fetch. In case of CORS issues on client, this may fail and cascade to RAWG.
    const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.items && data.items.length > 0) {
        const item = data.items[0];
        let iconUrl = item.tiny_image || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`;
        if (iconUrl.includes('?')) {
          iconUrl = iconUrl.split('?')[0];
        }
        // Migrate to CDN URL to avoid deprecated paths
        return iconUrl.replace(/https:\/\/cdn\.akamai\.steamstatic\.com\/steam\/(apps|subs|bundles)\//g, 'https://shared.akamai.steamstatic.com/store_item_assets/steam/$1/');
      }
    }
  } catch (err) {
    console.warn("Steam Store direct fetch failed (CORS or network):", err.message);
  }
  return null;
}

/**
 * Searches for a game cover using the RAWG.io API.
 * @param {string} query Game title to search.
 * @returns {Promise<string|null>} Resolved cover URL or null.
 */
export async function fetchRawgCover(query) {
  if (!RAWG_API_KEY || RAWG_API_KEY === "RAWG_API_KEY_PLACEHOLDER") {
    console.warn("RAWG_API_KEY is not configured.");
    return null;
  }
  try {
    const res = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${RAWG_API_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results[0].background_image || null;
      }
    }
  } catch (err) {
    console.error("RAWG API query error:", err.message);
  }
  return null;
}

/**
 * Searches for a brand logo using Logo.dev.
 * @param {string} query Brand name.
 * @returns {Promise<string|null>} Resolved logo URL or null.
 */
export async function fetchLogoDev(query) {
  const pubToken = (
    !LOGODEV_PUBLISHABLE_KEY || 
    LOGODEV_PUBLISHABLE_KEY === "LOGODEV_PUBLISHABLE_KEY_PLACEHOLDER"
  )
    ? 'live_6a1a28fd-6420-4492-aeb0-b297461d9de2'
    : LOGODEV_PUBLISHABLE_KEY;

  try {
    const res = await fetch(`https://www.logo.dev/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const item = data[0];
        if (item.domain) {
          return `https://img.logo.dev/${item.domain}?token=${pubToken}`;
        }
      }
    }
  } catch (err) {
    console.error("Logo.dev API search error:", err.message);
  }
  return null;
}

/**
 * Searches for a brand logo using Brandfetch (via Vercel Serverless Function).
 * @param {string} query Brand name.
 * @returns {Promise<string|null>} Resolved logo URL or null.
 */
export async function fetchBrandfetchLogo(query) {
  try {
    const res = await fetch(`/api/brandfetch-search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const brand = data[0];
        const cTokenMatch = brand.icon ? brand.icon.match(/[?&]c=([^&]+)/) : null;
        const cToken = cTokenMatch ? cTokenMatch[1] : '1ax1781966806943bfumLaCV7mvIC5iK4g';
        if (brand.domain) {
          return `https://cdn.brandfetch.io/domain/${brand.domain}?c=${cToken}`;
        }
      }
    }
  } catch (err) {
    console.error("Brandfetch search function error:", err.message);
  }
  return null;
}

/**
 * Perform a unified fallback resolution.
 * @param {string} name Product or Game name.
 * @param {string} category Category ('Gaming', 'Streaming', etc.).
 * @returns {Promise<string>} Resolved cover/logo URL (proxied if external) or local placeholder.
 */
export async function resolveMedia(name, category = "auto") {
  const isGaming = category.toLowerCase().includes("gaming") || 
                   category.toLowerCase().includes("game") ||
                   (category === "auto" && (name.toLowerCase().includes("steam") || name.toLowerCase().includes("playstation") || name.toLowerCase().includes("xbox") || name.toLowerCase().includes("wwe") || name.toLowerCase().includes("gta") || name.toLowerCase().includes("fifa")));

  if (isGaming) {
    // 3-tier fallback chain for gaming: Steam -> RAWG -> Server-side backend search -> Local Placeholder
    let resolved = await fetchSteamCover(name);
    if (resolved) return getProxiedUrl(resolved);

    resolved = await fetchRawgCover(name);
    if (resolved) return getProxiedUrl(resolved);

    // Fall back to server-side search which has additional platforms (Epic, Lutris, IGDB)
    try {
      const res = await fetch(`${API_BASE}/api/search-games?q=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        const firstGame = data.find(item => item.type === 'Game');
        if (firstGame && firstGame.icon) {
          return getProxiedUrl(firstGame.icon);
        }
      }
    } catch (err) {
      console.warn("Server search fallback failed:", err.message);
    }

    return PLACEHOLDER_GAME;
  } else {
    // OTT Brandfallback chain: Logo.dev -> Brandfetch -> Local Placeholder
    let resolved = await fetchLogoDev(name);
    if (resolved) return getProxiedUrl(resolved);

    resolved = await fetchBrandfetchLogo(name);
    if (resolved) return getProxiedUrl(resolved);

    // Fall back to server-side search
    try {
      const res = await fetch(`${API_BASE}/api/search-games?q=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        const firstBrand = data.find(item => item.type === 'OTT/Brand');
        if (firstBrand && firstBrand.icon) {
          return getProxiedUrl(firstBrand.icon);
        }
      }
    } catch (err) {
      console.warn("Server search brand fallback failed:", err.message);
    }

    return PLACEHOLDER_OTT;
  }
}

/**
 * Performs a unified search across backend search-games API with direct client-side fallback query matching.
 * @param {string} query Search query.
 * @param {string} category Category ('Gaming', 'Streaming', 'auto', etc.).
 * @returns {Promise<Array>} List of matched results with name, domain, icon, type.
 */
export async function unifiedSearch(query, category = "auto") {
  if (!query || query.trim().length < 2) return [];

  // Try backend unified search first
  try {
    const res = await fetch(`${API_BASE}/api/search-games?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(g => {
          const isGame = g.type === 'Game' || isGamingCategory(category);
          const persistentIcon = g.icon || (g.domain && !isGame
            ? `https://cdn.brandfetch.io/domain/${g.domain}?c=1ax1781966806943bfumLaCV7mvIC5iK4g`
            : `https://www.google.com/s2/favicons?domain=${g.domain || 'google.com'}&sz=256`);
          return {
            name: g.name,
            domain: g.domain || (isGame ? 'Steam Game' : 'Brand'),
            icon: persistentIcon,
            type: g.type || (isGame ? 'Game' : 'OTT/Brand'),
            source: g.source
          };
        });

        const qLower = query.toLowerCase().trim();
        mapped.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const domA = (a.domain || '').toLowerCase();
          const domB = (b.domain || '').toLowerCase();

          // 1. Exact match for name
          const exactNameA = nameA === qLower;
          const exactNameB = nameB === qLower;
          if (exactNameA && !exactNameB) return -1;
          if (!exactNameA && exactNameB) return 1;

          // 2. Exact match for domain stem
          const stemA = domA.split('.')[0];
          const stemB = domB.split('.')[0];
          const exactStemA = stemA === qLower;
          const exactStemB = stemB === qLower;
          if (exactStemA && !exactStemB) return -1;
          if (!exactStemA && exactStemB) return 1;

          // 3. Name starts with the query
          const startsA = nameA.startsWith(qLower);
          const startsB = nameB.startsWith(qLower);
          if (startsA && !startsB) return -1;
          if (!startsA && startsB) return 1;

          // 4. Domain starts with the query
          const domStartsA = domA.startsWith(qLower);
          const domStartsB = domB.startsWith(qLower);
          if (domStartsA && !domStartsB) return -1;
          if (!domStartsA && domStartsB) return 1;

          // 5. Name contains the query
          const containsA = nameA.includes(qLower);
          const containsB = nameB.includes(qLower);
          if (containsA && !containsB) return -1;
          if (!containsA && containsB) return 1;

          // 6. Domain contains the query
          const domContainsA = domA.includes(qLower);
          const domContainsB = domB.includes(qLower);
          if (domContainsA && !domContainsB) return -1;
          if (!domContainsA && domContainsB) return 1;

          return 0;
        });

        return mapped;
      }
    }
  } catch (err) {
    console.warn("Backend unified search failed, falling back to direct API lookup:", err.message);
  }

  // Client-side fallback queries if backend is down or returned empty results
  const results = [];
  const isGaming = category.toLowerCase().includes("gaming") || 
                   category.toLowerCase().includes("game") ||
                   (category === "auto" && (query.toLowerCase().includes("steam") || query.toLowerCase().includes("playstation") || query.toLowerCase().includes("xbox")));

  if (isGaming) {
    // Query Steam & RAWG directly
    const steamCover = await fetchSteamCover(query);
    if (steamCover) {
      results.push({ name: query, domain: 'Steam Game', icon: steamCover, type: 'Game', source: 'Steam' });
    }
    const rawgCover = await fetchRawgCover(query);
    if (rawgCover && rawgCover !== steamCover) {
      results.push({ name: query, domain: 'RAWG Game', icon: rawgCover, type: 'Game', source: 'RAWG' });
    }
  } else {
    // Query Logo.dev & Brandfetch directly
    const logoDev = await fetchLogoDev(query);
    if (logoDev) {
      results.push({ name: query, domain: query.toLowerCase() + '.com', icon: logoDev, type: 'OTT/Brand', source: 'Logo.dev' });
    }
    const brandfetch = await fetchBrandfetchLogo(query);
    if (brandfetch) {
      results.push({ name: query, domain: query.toLowerCase() + '.com', icon: brandfetch, type: 'OTT/Brand', source: 'Brandfetch' });
    }
  }

  const qLower = query.toLowerCase().trim();
  results.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const domA = (a.domain || '').toLowerCase();
    const domB = (b.domain || '').toLowerCase();

    // 1. Exact match for name
    const exactNameA = nameA === qLower;
    const exactNameB = nameB === qLower;
    if (exactNameA && !exactNameB) return -1;
    if (!exactNameA && exactNameB) return 1;

    // 2. Exact match for domain stem
    const stemA = domA.split('.')[0];
    const stemB = domB.split('.')[0];
    const exactStemA = stemA === qLower;
    const exactStemB = stemB === qLower;
    if (exactStemA && !exactStemB) return -1;
    if (!exactStemA && exactStemB) return 1;

    // 3. Name starts with the query
    const startsA = nameA.startsWith(qLower);
    const startsB = nameB.startsWith(qLower);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;

    // 4. Domain starts with the query
    const domStartsA = domA.startsWith(qLower);
    const domStartsB = domB.startsWith(qLower);
    if (domStartsA && !domStartsB) return -1;
    if (!domStartsA && domStartsB) return 1;

    // 5. Name contains the query
    const containsA = nameA.includes(qLower);
    const containsB = nameB.includes(qLower);
    if (containsA && !containsB) return -1;
    if (!containsA && containsB) return 1;

    // 6. Domain contains the query
    const domContainsA = domA.includes(qLower);
    const domContainsB = domB.includes(qLower);
    if (domContainsA && !domContainsB) return -1;
    if (!domContainsA && domContainsB) return 1;

    return 0;
  });

  return results;
}

// Simple local helper to match categories
function isGamingCategory(cat) {
  if (!cat) return false;
  const c = cat.toLowerCase().trim();
  return c === 'gaming' || c === 'steam' || c === 'playstation' || c === 'xbox' || c === 'epic' || c === 'games' || c === 'game' || c.includes('gaming') || c.includes('game');
}

