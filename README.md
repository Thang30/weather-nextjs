# Weather Dashboard

A responsive weather dashboard built with Next.js 15 that provides real-time weather information.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

You can get an API key from [OpenWeather](https://openweathermap.org/api).

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
