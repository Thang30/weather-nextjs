import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    // Get headers in a type-safe way
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Fetch both basic and extended data
    const [weatherResponse, extendedResponse] = await Promise.all([
      fetch(
        `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      ),
      fetch(`${protocol}://${host}/api/weather/extended?lat=${lat}&lon=${lon}`)
    ]);

    const [data, extendedData] = await Promise.all([
      weatherResponse.json(),
      extendedResponse.ok ? extendedResponse.json() : null
    ]);

    // Transform the data to match our WeatherData interface
    const weatherData = {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      icon: data.weather[0].icon,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      // Add extended data if available
      ...(extendedData && {
        airQuality: extendedData.airQuality,
        precipitation: extendedData.precipitation,
        sun: extendedData.sun
      })
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 