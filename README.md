# Weather Dashboard

A responsive weather dashboard built with Next.js 15 that provides real-time weather information. Check out the live demo: [Weather Dashboard](https://weather-nextjs-9lskdpi3r-thomas-projects-701af544.vercel.app/)

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

## Deployment

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. Create a Vercel account if you don't have one
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the project directory
4. Follow the prompts to deploy

Alternatively, you can deploy directly from GitHub:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add your environment variables
5. Deploy!

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- OpenWeather API
- Vercel for deployment
