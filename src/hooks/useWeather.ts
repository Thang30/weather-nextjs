'use client';

import { useState, useCallback } from 'react';
import { WeatherData, LocationData, ForecastData } from '@/types';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherResponse, forecastResponse, extendedResponse] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        fetch(`/api/forecast?lat=${lat}&lon=${lon}`),
        fetch(`/api/weather/extended?lat=${lat}&lon=${lon}`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok || !extendedResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weather, forecast, extended] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json(),
        extendedResponse.json()
      ]);

      setWeatherData({
        ...weather,
        airQuality: extended.airQuality,
        precipitation: extended.precipitation,
        sun: extended.sun
      });
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      await fetchWeather(latitude, longitude);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Please allow location access to use this feature');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An error occurred while getting your location');
        }
      } else {
        setError('Failed to detect location');
      }
    }
  }, [fetchWeather]);

  const searchCity = useCallback(async (query: string): Promise<LocationData[]> => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search location');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search location');
      return [];
    }
  }, []);

  return {
    weatherData,
    forecastData,
    isLoading,
    error,
    fetchWeather,
    detectLocation,
    searchCity,
  };
} 