export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  location: string;
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
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
} 