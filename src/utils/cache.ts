import { cache } from 'react';
import 'server-only';

// Cache durations in seconds
export const CACHE_DURATIONS = {
  WEATHER: 300,      // 5 minutes for current weather
  FORECAST: 1800,    // 30 minutes for forecast
  LOCATION: 86400,   // 24 hours for location data
} as const;

// Type for cache tags
export type CacheTag = 'weather' | 'forecast' | 'location';

// Cache invalidation function
export async function invalidateCache(tag: CacheTag) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag }),
    });
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
}

// Cached data fetching utilities
export const getCachedWeather = cache(async (lat: number, lon: number) => {
  // Implementation will be added when API key is ready
  return null;
});

export const getCachedForecast = cache(async (lat: number, lon: number) => {
  // Implementation will be added when API key is ready
  return null;
});

export const getCachedLocation = cache(async (query: string) => {
  // Implementation will be added when API key is ready
  return null;
});

export async function getWeatherFromCache(_lat: number, _lon: number) {
  // Implementation
}

export async function getForecastFromCache(_lat: number, _lon: number) {
  // Implementation
}

export async function getSearchResultsFromCache(_query: string) {
  // Implementation
} 