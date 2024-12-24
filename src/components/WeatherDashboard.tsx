'use client';

import { Suspense } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';
import { LocationHistory } from '@/components/LocationHistory';
import { addToLocationHistory } from '@/utils/locationHistory';
import { PreferencesPanel } from '@/components/PreferencesPanel';
import { usePreferences } from '@/contexts/PreferencesContext';
import { TemperatureDisplay, WindSpeedDisplay } from '@/components/UnitDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WeatherSkeleton } from '@/components/WeatherSkeleton';
import { SearchSkeleton } from '@/components/SearchSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMessage } from '@/components/ErrorMessage';

export function WeatherDashboard() {
  const { weatherData, forecastData, isLoading, error, fetchWeather, searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const { preferences } = usePreferences();

  // Use default location from preferences if available
  useEffect(() => {
    if (preferences.defaultLocation) {
      const { lat, lon } = preferences.defaultLocation;
      fetchWeather(lat, lon);
    } else {
      // Fallback to London
      fetchWeather(51.5074, -0.1278);
    }
  }, [fetchWeather, preferences.defaultLocation]);

  const convertTemperature = (celsius: number): number => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const locations = await searchCity(searchQuery);
    if (locations.length > 0) {
      const { lat, lon, name, country } = locations[0];
      
      // Add to location history with current weather
      addToLocationHistory({
        name,
        country,
        lat,
        lon,
        lastWeather: weatherData ? {
          temperature: weatherData.temperature,
          condition: weatherData.condition
        } : undefined
      });

      fetchWeather(lat, lon);
      setSearchQuery('');
    }
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    fetchWeather(lat, lon);
  };

  const handleRetry = () => {
    if (preferences.defaultLocation) {
      const { lat, lon } = preferences.defaultLocation;
      fetchWeather(lat, lon);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
              Weather Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <PreferencesPanel />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <ErrorBoundary>
              <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-4">
                {/* Search */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search city..."
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Searching...
                        </span>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                </div>

                <Suspense fallback={null}>
                  <LocationHistory onSelectLocation={handleLocationSelect} />
                </Suspense>
              </div>
            </ErrorBoundary>
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-8">
            <ErrorBoundary>
              <Suspense fallback={<WeatherSkeleton />}>
                {error ? (
                  <ErrorMessage
                    title="Failed to load weather data"
                    message={error}
                    retry={handleRetry}
                  />
                ) : weatherData && (
                  <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow overflow-hidden">
                    {/* Current Weather */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">{weatherData.location}</h2>
                          <p className="mt-1 text-gray-500">{weatherData.condition}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <div className="text-4xl font-bold">
                            <TemperatureDisplay value={weatherData.temperature} />
                          </div>
                        </div>
                      </div>

                      {/* Weather Details */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-500">Humidity</p>
                          <p className="mt-1 text-2xl font-semibold">{weatherData.humidity}%</p>
                        </div>
                        {weatherData.windSpeed !== undefined && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500">Wind Speed</p>
                            <p className="mt-1 text-2xl font-semibold">
                              <WindSpeedDisplay value={weatherData.windSpeed} />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
} 