# Pyxis Search Engine – Frontend

Next.js frontend for Pyxis. Provides a fast, responsive UI for text, image, video, news, and book search with instant answers and autocomplete.

## Features

- **Five search types** – dedicated result pages for text, images, videos, news, and books
- **Instant answer panel** – concise factual answers with an optional related image
- **Autocomplete** – real-time query suggestions from the backend API
- **Related searches** – keyword chips linking to related queries
- **Animated UI** – smooth transitions via Framer Motion
- **API proxying** – `/api/*` requests are proxied to the backend in both development and production

## Technology Stack

- **Next.js** (App Router) with TypeScript
- **Tailwind CSS v4** + PostCSS
- **Framer Motion** for animations
- **SWR** for client-side data fetching with SSR fallback
- **Node.js** 20 LTS or higher

## Getting Started

### Prerequisites

- Node.js 20 LTS or newer
- Backend API running (default `http://localhost:5000`)

### Installation

```bash
git clone https://github.com/muyeed15/pyxis.git
cd pyxis/frontend/client
npm install
```

### Environment Variables

```bash
cp env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_URL_BACKEND_API` | `http://localhost:5000` | Backend API URL (used by server-side fetch) |
| `NEXT_PUBLIC_URL_FRONTEND` | `http://localhost:3000` | Frontend public URL (for canonical/OG meta tags) |

> `NEXT_PUBLIC_` variables are embedded in the browser bundle at build time. A rebuild is required after changing them.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requests to `/api/*` are proxied to `http://localhost:5000` as defined in `next.config.ts`.

### Production

```bash
npm run build
npm start
```

Change port: `PORT=4000 npm start`

### PM2

```bash
npm install -g pm2
```

Example `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'pyxis-frontend',
    cwd: '/path/to/frontend/client',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
};
```

```bash
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

## Project Structure

```
app/
├── components/
│   ├── homesearchbar.tsx       # Homepage search bar
│   ├── instantanswer.tsx       # Instant answer panel
│   ├── relatedsearches.tsx     # Related search keyword chips
│   └── searchheader.tsx        # Header with search bar and type tabs
├── search/
│   ├── text/                   # Text search results
│   │   ├── page.tsx
│   │   ├── pagewrapper.tsx
│   │   └── text.tsx
│   ├── image/                  # Image search results
│   │   ├── image-category-bar.tsx
│   │   ├── image.tsx
│   │   ├── page.tsx
│   │   └── pagewrapper.tsx
│   ├── video/                  # Video search results
│   │   ├── page.tsx
│   │   ├── pagewrapper.tsx
│   │   └── video.tsx
│   ├── news/                   # News search results
│   │   ├── news.tsx
│   │   ├── page.tsx
│   │   └── pagewrapper.tsx
│   └── book/                   # Book search results
│       ├── book.tsx
│       ├── librarycategories.tsx
│       ├── page.tsx
│       └── pagewrapper.tsx
├── signin/
│   ├── page.tsx
│   └── signinwrapper.tsx
├── about/
│   └── page.tsx
├── privacy/
│   └── page.tsx
├── terms/
│   └── page.tsx
├── globals.css
├── layout.tsx
├── page.tsx                    # Homepage
├── providers.tsx
└── types.ts                    # Shared TypeScript types
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Production server (requires build) |
| `npm run lint` | ESLint |

## Troubleshooting

- **Backend connection refused** – ensure the backend is running and `NEXT_PUBLIC_URL_BACKEND_API` is correct.
- **API 404 in development** – check that `next.config.ts` rewrites `/api/*` to the correct backend host/port.
- **Dev origin errors** – if accessing from a custom domain, add it to `allowedDevOrigins` in `next.config.ts`.
- **Images not loading** – `next.config.ts` allows all HTTPS hostnames; HTTP image sources are not optimised by Next.js.
