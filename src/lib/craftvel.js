/**
 * NekoStream Server-side Craftvel API Client
 * Mengisolasi semua request ke backend Craftvel v1 dan menjamin x-api-key HANYA berada di server.
 */

const API_BASE_URL = process.env.CRAFTVEL_API_URL || 'https://api.craftvel.com';
const MEDIA_BASE_URL = process.env.CRAFTVEL_MEDIA_URL || 'https://media.craftvel.com';
const API_KEY = process.env.CRAFTVEL_API_KEY;

/**
 * Helper untuk normalisasi path legacy (/services/...) ke v1
 */
function normalizeEndpoint(endpoint) {
  if (endpoint.startsWith('/services/anime/home')) {
    return '/v1/anime/home';
  }
  if (endpoint.startsWith('/services/anime/ongoing')) {
    return endpoint.replace('/services/anime/ongoing', '/v1/anime/ongoing');
  }
  if (endpoint.startsWith('/services/anime/completed')) {
    return endpoint.replace('/services/anime/completed', '/v1/anime/completed');
  }
  if (endpoint.startsWith('/services/anime/search')) {
    return endpoint.replace('/services/anime/search', '/v1/anime/search');
  }
  if (endpoint.startsWith('/services/anime/stream/')) {
    const epSlug = endpoint.replace('/services/anime/stream/', '');
    return `/v1/anime/episodes/${epSlug}/stream`;
  }
  if (endpoint.startsWith('/services/usage')) {
    return '/v1/me/usage';
  }
  if (endpoint.startsWith('/services/anime/')) {
    const animeSlug = endpoint.replace('/services/anime/', '');
    return `/v1/anime/${animeSlug}`;
  }
  return endpoint;
}

export async function fetchCraftvel(endpoint, options = {}) {
  const v1Endpoint = normalizeEndpoint(endpoint);
  const url = `${API_BASE_URL}${v1Endpoint}`;

  // Hanya endpoint stream, download, dan me/usage yang memerlukan x-api-key.
  // Seluruh katalog publik (home, ongoing, completed, popular, search, genres, detail, episodes)
  // diakses TANPA API key sehingga 100% BEBAS kuota (Zero Quota Consumption).
  const requiresAuth =
    v1Endpoint.includes('/stream') ||
    v1Endpoint.includes('/download') ||
    v1Endpoint.includes('/me/') ||
    v1Endpoint.includes('/usage');

  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 NekoStream/1.0',
    ...(options.headers || {}),
  };

  if (requiresAuth && API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      next: options.next || { revalidate: requiresAuth ? 0 : 300 },
    });

    if (!response.ok) {
      let errDetail = `Status ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) {
          errDetail = errJson.error.message;
        }
      } catch (_) {}
      throw new Error(`[Craftvel API] ${errDetail}`);
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.error(`[Server API Fetch Error] ${endpoint} -> ${v1Endpoint}:`, err.message);

    // Fallback otomatis ke mock data jika sewaktu-waktu server eksternal offline/jaringan terputus
    const {
      MOCK_POPULAR_BANNER,
      MOCK_ONGOING_ITEMS,
      MOCK_COMPLETED_ITEMS,
      MOCK_ANIME_DETAILS,
      MOCK_STREAM_DATA
    } = await import('./mockData');

    if (v1Endpoint.includes('/anime/home')) {
      return {
        data: {
          popular_banner: MOCK_POPULAR_BANNER,
          ongoing: MOCK_ONGOING_ITEMS,
          completed: MOCK_COMPLETED_ITEMS,
        }
      };
    }
    if (v1Endpoint.includes('/anime/ongoing')) {
      return {
        data: {
          items: MOCK_ONGOING_ITEMS,
          total: MOCK_ONGOING_ITEMS.length,
        }
      };
    }
    if (v1Endpoint.includes('/anime/completed')) {
      return {
        data: {
          items: MOCK_COMPLETED_ITEMS,
          total: MOCK_COMPLETED_ITEMS.length,
        }
      };
    }
    if (v1Endpoint.includes('/anime/search')) {
      const q = endpoint.split('q=')[1]?.split('&')[0]?.toLowerCase() || '';
      const decodedQ = decodeURIComponent(q);
      const allItems = [...MOCK_ONGOING_ITEMS, ...MOCK_COMPLETED_ITEMS];
      const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(decodedQ) || item.slug.toLowerCase().includes(decodedQ)
      );
      return {
        data: {
          items: filtered.length > 0 ? filtered : allItems.slice(0, 4),
          total: filtered.length,
        }
      };
    }
    if (v1Endpoint.includes('/me/usage') || v1Endpoint.includes('/usage')) {
      return {
        plan: 'solo',
        quota: '100k/bulan',
        rate_limit_per_minute: 60,
      };
    }
    if (v1Endpoint.includes('/stream')) {
      return MOCK_STREAM_DATA;
    }
    if (v1Endpoint.startsWith('/v1/anime/')) {
      const slug = v1Endpoint.replace('/v1/anime/', '');
      return {
        data: MOCK_ANIME_DETAILS[slug] || {
          ...MOCK_ANIME_DETAILS['solo-leveling-season-2'],
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug,
        }
      };
    }

    throw err;
  }
}

/**
 * Normalisasi URL poster jika mengarah ke relative path
 */
export function normalizePosterUrl(url) {
  if (!url) return '/placeholder-poster.webp';
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

/**
 * Normalisasi URL video stream direct ke gateway media.craftvel.com
 */
export function normalizeStreamUrl(url) {
  if (!url || url.startsWith('upgrade://')) return url;
  if (url.startsWith('/')) {
    return `${MEDIA_BASE_URL}${url}`;
  }
  return url;
}
