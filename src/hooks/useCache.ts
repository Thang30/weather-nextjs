import { useState, useCallback } from 'react';
import { CacheTag, invalidateCache } from '@/utils/cache';

export function useCache() {
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidate = useCallback(async (tag: CacheTag) => {
    setIsInvalidating(true);
    setError(null);

    try {
      await invalidateCache(tag);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invalidate cache');
    } finally {
      setIsInvalidating(false);
    }
  }, []);

  return {
    isInvalidating,
    error,
    invalidate,
  };
} 