import { cacheGet, cacheSet, cacheDel, cacheClear, cacheSize } from '../src/lib/cache';

describe('Cache utility', () => {
  beforeEach(() => {
    cacheClear();
  });

  it('returns null for a missing key', () => {
    expect(cacheGet('missing')).toBeNull();
  });

  it('stores and retrieves a value', () => {
    cacheSet('key1', { foo: 'bar' }, 10_000);
    expect(cacheGet('key1')).toEqual({ foo: 'bar' });
  });

  it('returns null for an expired entry', async () => {
    cacheSet('key2', 'value', 1); // 1 ms TTL
    await new Promise((r) => setTimeout(r, 10));
    expect(cacheGet('key2')).toBeNull();
  });

  it('deletes a specific key', () => {
    cacheSet('key3', 'hello', 10_000);
    cacheDel('key3');
    expect(cacheGet('key3')).toBeNull();
  });

  it('tracks cache size', () => {
    cacheSet('a', 1, 10_000);
    cacheSet('b', 2, 10_000);
    expect(cacheSize()).toBe(2);
  });
});
