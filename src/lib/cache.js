// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.

export function createCache(ttlSeconds) {
  const weatherData = new Map();

  let hits = 0;
  let misses = 0;

  function get(key) {
    const cachedEntry = weatherData.get(key);

    if (cachedEntry === undefined) {
      misses++;
      return undefined;
    }

    if (Date.now() >= cachedEntry.expiresAt) {
      weatherData.delete(key);
      misses++;
      return undefined;
    }

    hits++;
    return cachedEntry.value;
  }

  function set(key, value) {
    weatherData.set(key, {
        
      value: value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  function stats() {
    const currentTime = Date.now();

    for (const [key, cachedEntry] of weatherData.entries()) {
      if (currentTime >= cachedEntry.expiresAt) {
        weatherData.delete(key);
      }
    }

    return {
      entries: weatherData.size,
      hits: hits,
      misses: misses,
      ttlSeconds: ttlSeconds
    };
  }

  return { get, set, stats };
}
