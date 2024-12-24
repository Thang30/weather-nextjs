export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed?: number;
  feelsLike: number;
  icon: string;
  description: string;
  pressure: number;
  visibility: number;
  sunrise?: number;
  sunset?: number;
  alerts?: WeatherAlert[];
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
  country: string;
  lat: number;
  lon: number;
}

export interface LocationHistoryItem extends LocationData {
  timestamp: number;
  lastWeather?: {
    temperature: number;
    condition: string;
  };
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  speedUnit: 'ms' | 'kmh' | 'mph';
  theme: 'light' | 'dark';
  defaultLocation?: {
    lat: number;
    lon: number;
  };
}

export interface WeatherAlert {
  senderName: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'moderate' | 'severe' | 'extreme';
} 