import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const ONECALL_API_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const AIR_QUALITY_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

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
    // Fetch both weather and air quality data in parallel
    const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(
        `${ONECALL_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`
      ),
      fetch(
        `${AIR_QUALITY_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      )
    ]);

    if (!weatherResponse.ok || !airQualityResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const [weather, airQuality] = await Promise.all([
      weatherResponse.json(),
      airQualityResponse.json()
    ]);

    // Transform the data
    const extendedData = {
      airQuality: {
        aqi: airQuality.list[0].main.aqi,
        components: airQuality.list[0].components
      },
      precipitation: {
        probability: weather.hourly[0].pop, // Probability of precipitation
        amount: weather.hourly[0].rain?.['1h'] || 0 // Rain amount in mm for next hour
      },
      sun: {
        sunrise: weather.current.sunrise,
        sunset: weather.current.sunset,
        dayLength: Math.round((weather.current.sunset - weather.current.sunrise) / 60) // in minutes
      }
    };

    return NextResponse.json(extendedData);
  } catch (error) {
    console.error('Extended weather data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch extended weather data' },
      { status: 500 }
    );
  }
} 