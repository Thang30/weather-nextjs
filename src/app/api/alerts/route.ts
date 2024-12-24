import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const ONECALL_API_URL = 'https://api.openweathermap.org/data/3.0/onecall';

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
      `${ONECALL_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&exclude=minutely,hourly,daily&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts');
    }

    const data = await response.json();
    
    // Transform alerts data to match our interface
    const alerts = data.alerts?.map((alert: any) => ({
      senderName: alert.sender_name,
      event: alert.event,
      start: alert.start,
      end: alert.end,
      description: alert.description,
      severity: getSeverity(alert.event.toLowerCase())
    })) || [];

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Weather alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather alerts' },
      { status: 500 }
    );
  }
}

function getSeverity(event: string): 'moderate' | 'severe' | 'extreme' {
  if (event.includes('extreme') || event.includes('hurricane') || event.includes('tornado')) {
    return 'extreme';
  }
  if (event.includes('severe') || event.includes('warning')) {
    return 'severe';
  }
  return 'moderate';
} 