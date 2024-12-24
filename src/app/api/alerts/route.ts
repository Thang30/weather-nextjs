import { NextResponse } from 'next/server';
import { WeatherAlert } from '@/types';

interface AlertResponse {
  alerts: WeatherAlert[];
}

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
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&exclude=current,minutely,hourly,daily`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }

    const data = (await response.json()) as AlertResponse;
    return NextResponse.json(data.alerts || []);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 