// Redis-ready caching utility
// Currently uses in-memory cache, can be easily switched to Redis

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  // Set cache with TTL
  set(key, value, ttlSeconds = 3600) {
    this.cache.set(key, value);
    
    if (ttlSeconds) {
      const expiresAt = Date.now() + (ttlSeconds * 1000);
      this.ttl.set(key, expiresAt);
      
      // Auto-cleanup
      setTimeout(() => {
        this.delete(key);
      }, ttlSeconds * 1000);
    }
  }

  // Get from cache
  get(key) {
    // Check if expired
    if (this.ttl.has(key)) {
      const expiresAt = this.ttl.get(key);
      if (Date.now() > expiresAt) {
        this.delete(key);
        return null;
      }
    }
    
    return this.cache.get(key);
  }

  // Delete from cache
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  // Check if key exists
  has(key) {
    if (this.ttl.has(key)) {
      const expiresAt = this.ttl.get(key);
      if (Date.now() > expiresAt) {
        this.delete(key);
        return false;
      }
    }
    return this.cache.has(key);
  }

  // Get cache size
  size() {
    return this.cache.size;
  }
}

// Singleton instance
const cache = new CacheManager();

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method
    res.json = (body) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

module.exports = {
  cache,
  cacheMiddleware,
};
