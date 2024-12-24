import { WeatherData, ForecastData, LocationData } from '@/types';
import { mockWeatherData, mockForecastData, mockLocationData } from './mockData';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// Cache duration in seconds
const CACHE_DURATION = {
  CURRENT_WEATHER: 600, // 10 minutes
  FORECAST: 1800, // 30 minutes
  LOCATION: 86400, // 24 hours
};

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (IS_DEVELOPMENT) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWeatherData;
  }

  // Construct URL with all needed parameters
  const url = `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  // Use Next.js 15's fetch with caching options
  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION.CURRENT_WEATHER,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  if (IS_DEVELOPMENT) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockForecastData;
  }

  const url = `${WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION.FORECAST,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.statusText}`);
  }

  return response.json();
}

// Geocoding API for city search
export async function searchLocation(query: string): Promise<LocationData[]> {
  if (IS_DEVELOPMENT) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLocationData.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_DURATION.LOCATION,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.statusText}`);
  }

  return response.json();
} 