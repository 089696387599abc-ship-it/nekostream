/**
 * NekoStream Server-side Craftvel API Client
 * Mengisolasi semua request ke backend Craftvel dan menjamin x-api-key HANYA berada di server.
 */

const API_BASE_URL = process.env.CRAFTVEL_API_URL || 'https://api.craftvel.com';
const MEDIA_BASE_URL = process.env.CRAFTVEL_MEDIA_URL || 'https://media.craftvel.com';
const API_KEY = process.env.CRAFTVEL_API_KEY;

export async function fetchCraftvel(endpoint, options = {}) {
  if (!API_KEY) {
    throw new Error('CRAFTVEL_API_KEY belum dikonfigurasi di lingkungan server (.env.local)');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'x-api-key': API_KEY,
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 NekoStream/1.0',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Default revalidate 60 seconds untuk performa sub-millisecond edge cache
      next: options.next || { revalidate: 60 },
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

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`[Server API Fetch Error] ${endpoint}:`, err.message);
    throw err;
  }
}

/**
 * Normalisasi URL poster jika mengarah ke localhost atau relative path
 */
export function normalizePosterUrl(url) {
  if (!url) return '/placeholder-poster.webp';
  let cleaned = url.replace(/^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/, API_BASE_URL);
  if (cleaned.startsWith('/')) {
    cleaned = `${API_BASE_URL}${cleaned}`;
  }
  return cleaned;
}

/**
 * Normalisasi URL video stream direct ke gateway media.craftvel.com
 */
export function normalizeStreamUrl(url) {
  if (!url || url.startsWith('upgrade://')) return url;
  let cleaned = url.replace(/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/, MEDIA_BASE_URL);
  if (cleaned.startsWith('/')) {
    cleaned = `${MEDIA_BASE_URL}${cleaned}`;
  }
  return cleaned;
}
