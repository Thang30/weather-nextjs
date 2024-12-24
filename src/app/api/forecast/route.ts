import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

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
    const response = await fetch(
      `${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    
    // Transform the data to match our ForecastData interface
    const forecastData = {
      list: data.list.map((item: any) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: item.weather.map((w: any) => ({
          description: w.description,
          icon: w.icon
        }))
      }))
    };

    return NextResponse.json(forecastData);
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
} 