export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  location: string;
  // Add other relevant weather fields
}

export interface ForecastData {
  list: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
  // Add other relevant forecast fields
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
} 