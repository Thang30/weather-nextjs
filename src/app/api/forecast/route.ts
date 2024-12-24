import { NextResponse } from 'next/server';

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

// interface ForecastResponse {
//   list: ForecastItem[];
// }

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
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }

    const rawData = await response.json();
    
    // Transform the data to match our expected format
    const data = {
      list: rawData.list.map((item: ForecastItem) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: item.weather.map(w => ({
          description: w.description,
          icon: w.icon
        }))
      }))
    };

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 