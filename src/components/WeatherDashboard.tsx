import { useWeather } from '@/hooks/useWeather';
import { useEffect, useState } from 'react';

export function WeatherDashboard() {
  const { weatherData, forecastData, isLoading, error, fetchWeather, searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');

  // Demo coordinates (London)
  useEffect(() => {
    fetchWeather(51.5074, -0.1278);
  }, [fetchWeather]);

  const handleSearch = async () => {
    const locations = await searchCity(searchQuery);
    if (locations.length > 0) {
      const { lat, lon } = locations[0];
      fetchWeather(lat, lon);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search city..."
          className="p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Condition: {weatherData.condition}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
        </div>
      )}

      {/* Add forecast display here */}
    </div>
  );
} 