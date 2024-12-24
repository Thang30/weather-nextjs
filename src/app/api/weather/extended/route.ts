import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
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
    const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${AIR_QUALITY_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      )
    ]);

    const [weather, airQuality] = await Promise.all([
      weatherResponse.ok ? weatherResponse.json() : null,
      airQualityResponse.ok ? airQualityResponse.json() : null
    ]);

    // Build extended data from available responses
    const extendedData = {
      ...(airQuality && {
        airQuality: {
          aqi: airQuality.list[0].main.aqi,
          components: airQuality.list[0].components
        }
      }),
      precipitation: {
        probability: 0,
        amount: weather?.rain?.['1h'] || 0
      },
      sun: weather ? {
        sunrise: weather.sys.sunrise,
        sunset: weather.sys.sunset,
        dayLength: Math.round((weather.sys.sunset - weather.sys.sunrise) / 60)
      } : {
        sunrise: Math.floor(Date.now() / 1000) + 21600,
        sunset: Math.floor(Date.now() / 1000) + 64800,
        dayLength: 43200
      }
    };

    return NextResponse.json(extendedData);
  } catch (error) {
    console.error('Extended weather data error:', error);
    return NextResponse.json({
      sun: {
        sunrise: Math.floor(Date.now() / 1000) + 21600,
        sunset: Math.floor(Date.now() / 1000) + 64800,
        dayLength: 43200
      },
      precipitation: {
        probability: 0,
        amount: 0
      }
    });
  }
} 