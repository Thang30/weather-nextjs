# Weather Dashboard

A responsive weather dashboard built with Next.js 15 that provides real-time weather information. Check out the live demo: [weather-nextjs-rose.vercel.app](https://weather-nextjs-rose.vercel.app/)

## Features

- Real-time weather data from OpenWeather API
- 5-day weather forecast
- Air quality information
- Weather alerts
- Location search with autocomplete
- Location history
- Temperature unit conversion (°C/°F)
- Wind speed unit conversion (m/s, km/h, mph)
- Dark/Light theme
- Responsive design
- Default location settings

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

You can get an API key from [OpenWeather](https://openweathermap.org/api).

## Development

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- OpenWeather API
- Vercel for deployment

## License

MIT License
