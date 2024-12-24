'use client';

import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';
import { LocationHistory } from '@/components/LocationHistory';
import { addToLocationHistory } from '@/utils/locationHistory';
import { PreferencesPanel } from '@/components/PreferencesPanel';
import { usePreferences } from '@/contexts/PreferencesContext';
import { TemperatureDisplay, WindSpeedDisplay } from '@/components/UnitDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';

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
                    className="w-full sm:w-auto px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Location History */}
              <LocationHistory onSelectLocation={handleLocationSelect} />
            </div>
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-8">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {weatherData && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
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
          </div>
        </div>
      </main>
    </div>
  );
} 