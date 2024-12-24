import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeather API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    // Transform the data to match our LocationData interface
    const locations = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
} 