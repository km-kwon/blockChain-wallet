# Wallet as Gallery

Wallet as Gallery is a Vite + React MVP that turns an Ethereum wallet address or ENS name into a dashboard and a 3D gallery.

## Features

- ENS or Ethereum address input
- Wallet dashboard with token allocation, NFT collections, value history, and recent activity
- Client-only data flow with TanStack Query
- Alchemy live wallet data when `VITE_ALCHEMY_API_KEY` is configured
- CoinGecko token pricing with graceful fallback
- Mock data fallback when no API key is present
- 3D gallery mode with React Three Fiber, NFT frames, token hologram, pointer-lock movement, and NFT details
- Light/dark theme with local persistence

## Stack

- Vite, React, TypeScript
- React Router
- Tailwind CSS
- Zustand
- TanStack Query
- Recharts
- Three.js, @react-three/fiber, @react-three/drei
- Alchemy SDK, CoinGecko, viem

## Getting Started

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Environment

Create `.env.local`:

```bash
VITE_ALCHEMY_API_KEY=your_public_alchemy_key
```

If the key is omitted, the app renders with mock wallet data.

## Routes

- `/` - landing page
- `/:address` - dashboard mode
- `/:address/gallery` - 3D gallery mode

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run check
npm run preview
```

## Release Checklist

- Confirm `.env.local` contains `VITE_ALCHEMY_API_KEY` for live data.
- Run `npm run check`.
- Open `/`, `/:address`, and `/:address/gallery`.
- Verify the fallback notice appears if live API data is unavailable.
- Deploy the static build output from `dist/`.

## Deployment

The app is a static SPA and can be deployed to Vercel or Netlify.

For Vercel, `vercel.json` rewrites all routes to `index.html`.

For Netlify, `public/_redirects` does the same.

Set `VITE_ALCHEMY_API_KEY` in the hosting provider environment variables before deploying live data mode.
