/**
 * CacheManager — Cache centralizado com tipagem genérica
 * GOF Strategy Pattern: estratégia de cache unificada
 * Remove duplicação de cache entre controller e service
 */
import NodeCache from 'node-cache';
import { env } from './env';

class CacheManager {
    private cache: NodeCache;

    constructor(ttlSeconds?: number) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds || env.CACHE_TTL,
            checkperiod: 60,
            useClones: false, // Performance: avoid deep cloning large arrays
        });
    }

    get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    set<T>(key: string, value: T, ttl?: number): void {
        if (ttl !== undefined) {
            this.cache.set(key, value, ttl);
        } else {
            this.cache.set(key, value);
        }
    }

    del(key: string): void {
        this.cache.del(key);
    }

    flush(): void {
        this.cache.flushAll();
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }
}

// Singleton instance shared across the app
export const cacheManager = new CacheManager();
