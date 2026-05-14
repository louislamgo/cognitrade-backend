import { CacheEntry } from '../../types';

/**
 * Simple in-memory TTL cache.
 *
 * For production workloads with multiple workers or serverless cold-starts,
 * replace with a shared store such as Redis or Upstash.
 */
const store = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS =
  (parseInt(process.env.CACHE_DEFAULT_TTL_SECONDS ?? '300', 10) || 300) * 1000;

/**
 * Retrieves a cached value, or null if it is absent / expired.
 */
export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Stores a value in the cache with an optional TTL.
 *
 * @param key - Cache key
 * @param data - Value to store
 * @param ttlMs - Time-to-live in milliseconds (default: CACHE_DEFAULT_TTL_SECONDS × 1000)
 */
export function cacheSet<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Removes an entry from the cache.
 */
export function cacheDel(key: string): void {
  store.delete(key);
}

/**
 * Clears the entire cache. Use with caution.
 */
export function cacheClear(): void {
  store.clear();
}

/**
 * Returns the number of entries currently in the cache (including potentially
 * expired ones that haven't been evicted yet).
 */
export function cacheSize(): number {
  return store.size;
}
