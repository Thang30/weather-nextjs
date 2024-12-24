import { NextResponse } from 'next/server';
import { LocationData } from '@/types';

interface GeocodingResponse {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = (await response.json()) as GeocodingResponse[];
    const locations: LocationData[] = data.map(item => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));

    return NextResponse.json(locations);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 