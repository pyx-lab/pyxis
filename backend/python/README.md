# Pyxis Search Engine – Backend

Flask-based REST API that powers Pyxis. Fetches search results from DuckDuckGo, provides autocomplete suggestions and instant answers, and caches responses in Redis.

## Features

- **Search endpoints** – text, images, videos, news, and books (via `ddgs`)
- **Autocomplete** – local CSV-based suggestion engine with English word frequency ranking
- **Instant answers** – concise factual answers with an optional related image (DuckDuckGo + Wikipedia/Wikimedia Commons)
- **Content filtering** – blocked domains and blocked keywords loaded from CSV files at startup; safe image extensions enforced on instant search
- **Redis caching** – per-type TTLs reduce latency and external API calls
- **PM2 process management** – for production deployments

## Requirements

- Python 3.10 or higher
- Redis server (local or remote)
- Node.js (only needed for PM2)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/muyeed15/pyxis.git
cd pyxis/backend/python
```

### 2. Set up a Python environment

**Using Conda:**

```bash
conda create -n pyxis python=3.10
conda activate pyxis
```

**Using venv:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Keep dependencies up to date

The `ddgs` library scrapes DuckDuckGo and **must be kept up to date** — outdated versions will silently return empty results or break entirely when DuckDuckGo changes its internals.

Install `pip-review` to manage updates:

```bash
pip install pip-review
```

Review available updates (shows what will change before applying):

```bash
pip-review
```

Apply all updates at once:

```bash
pip-review --auto
```

Run this regularly, especially if searches stop returning results.

### 5. Install and start Redis

```bash
sudo apt update && sudo apt install redis-server
sudo systemctl enable --now redis-server
redis-cli ping   # should return PONG
```

### 5. Configure environment variables

```bash
cp env.example .env
```

Edit `.env` as needed. All variables have sensible defaults; at minimum check `REDIS_URL`.

### 6. Prepare datasets

**Autocomplete** – place three CSV files in `autocomplete/dataset/`:

| File | Format |
|------|--------|
| `entities.csv` | columns: `category`, `entity` |
| `keywords.csv` | one keyword per row |
| `patterns.csv` | columns: `type`, `pattern` |

**Content filters** – place CSV files in `filters/`:

| File | Format |
|------|--------|
| `blocked_keywords.csv` | one keyword per row – results containing these strings are dropped |
| `blocked_domains.csv` | one base domain per row – results from these domains are dropped |
| `safe_image_extensions.csv` | one extension per row (e.g. `.jpg`) – only these extensions are used for instant answer images |

## Running

### Development

```bash
python app.py
```

Server starts at `http://0.0.0.0:5000`.

### Production – Waitress

```bash
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

### Production – PM2 (recommended)

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs pyxis-flask-backend
pm2 restart pyxis-flask-backend
```

## API Endpoints

### `GET /`

Returns basic API info.

### `GET /help`

Returns endpoint documentation and module status.

### `GET /search`

| Parameter | Description | Example |
|-----------|-------------|---------|
| `q` | Search query | `q=python` |
| `type` | `text` \| `images` \| `videos` \| `news` \| `books` (default `text`) | `type=images` |
| `page` | Page number, 1-based (default `1`) | `page=2` |

```
GET /search?q=artificial+intelligence&type=text&page=1
```

### `GET /autocomplete`

| Parameter | Description | Example |
|-----------|-------------|---------|
| `q` | Partial query | `q=how+to` |

```
GET /autocomplete?q=how+to
```

### `GET /instant`

| Parameter | Description | Example |
|-----------|-------------|---------|
| `q` | Query | `q=elon+musk` |

```
GET /instant?q=elon+musk
```

## Environment Variables

All variables have defaults and are optional unless noted.

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL |
| `MAX_RETRIES` | `5` | Max retry attempts per search request |
| `RETRY_DELAYS` | `0.1,0.2,0.4,0.8` | Comma-separated exponential backoff delays (seconds) |
| `TEXT_MAX_RESULTS_PER_PAGE` | `10` | Text results per page |
| `TEXT_MAX_PAGES` | `10` | Max pages for text search |
| `IMAGE_MAX_RESULTS_PER_PAGE` | `20` | Image results per page |
| `IMAGE_MAX_PAGES` | `10` | Max pages for image search |
| `VIDEO_MAX_RESULTS_PER_PAGE` | `20` | Video results per page |
| `VIDEO_MAX_PAGES` | `10` | Max pages for video search |
| `NEWS_MAX_RESULTS_PER_PAGE` | `10` | News results per page |
| `NEWS_MAX_PAGES` | `10` | Max pages for news search |
| `BOOKS_MAX_RESULTS_PER_PAGE` | `10` | Book results per page |
| `BOOKS_MAX_PAGES` | `10` | Max pages for book search |
| `CACHE_TIMEOUT_TEXT` | `604800` | Text cache TTL in seconds (7 days) |
| `CACHE_TIMEOUT_IMAGE` | `259200` | Image cache TTL in seconds (3 days) |
| `CACHE_TIMEOUT_VIDEO` | `86400` | Video cache TTL in seconds (1 day) |
| `CACHE_TIMEOUT_NEWS` | `3600` | News cache TTL in seconds (1 hour) |
| `CACHE_TIMEOUT_BOOKS` | `1296000` | Books cache TTL in seconds (15 days) |
| `CACHE_TIMEOUT_AUTOCOMPLETE` | `2592000` | Autocomplete cache TTL in seconds (30 days) |
| `CACHE_TIMEOUT_INSTANT` | `2592000` | Instant answer cache TTL in seconds (30 days) |

## Project Structure

```
python/
├── app.py                      # Main Flask application
├── autocomplete/
│   ├── autocomplete.py
│   └── dataset/
│       ├── entities.csv
│       ├── keywords.csv
│       └── patterns.csv
├── filters/
│   ├── blocked_domains.csv
│   ├── blocked_keywords.csv
│   └── safe_image_extensions.csv
├── instantsearch/
│   └── instantsearch.py
├── ecosystem.config.js
├── env.example
└── README.md
```

## Cache Management

All search results, autocomplete suggestions, and instant answers are cached in Redis. Use these commands to clear cached data when needed.

### Flush everything

Removes all keys from all Redis databases. Use this after updating filter lists or to force completely fresh results.

```bash
redis-cli flushall
```

### Flush only the Pyxis database

If `REDIS_URL` uses a specific database number (e.g. `redis://localhost:6379/0` uses DB 0), you can flush just that database without affecting anything else on the same Redis instance:

```bash
redis-cli -n 0 flushdb
```

Replace `0` with the database number from your `REDIS_URL`.

### Flush by search type

To clear only one type of cached results, match keys by their cache prefix and delete them:

```bash
# Text search cache
redis-cli --scan --pattern "flask_cache_*text*" | xargs redis-cli del

# Image search cache
redis-cli --scan --pattern "flask_cache_*image*" | xargs redis-cli del

# Video search cache
redis-cli --scan --pattern "flask_cache_*video*" | xargs redis-cli del

# News search cache
redis-cli --scan --pattern "flask_cache_*news*" | xargs redis-cli del

# Books search cache
redis-cli --scan --pattern "flask_cache_*book*" | xargs redis-cli del

# Autocomplete cache
redis-cli --scan --pattern "flask_cache_*autocomplete*" | xargs redis-cli del

# Instant answer cache
redis-cli --scan --pattern "flask_cache_*instant*" | xargs redis-cli del
```

### Check cache size

```bash
redis-cli dbsize          # total number of keys
redis-cli info memory     # memory usage breakdown
```

### After flushing

The cache repopulates automatically on the next request for each query. In production, a full flush will temporarily increase load on DuckDuckGo until the cache warms back up.

## Troubleshooting

- **Redis errors** – verify Redis is running (`redis-cli ping`) and `REDIS_URL` in `.env` is correct.
- **Autocomplete unavailable** – check that all three CSV files exist in `autocomplete/dataset/`.
- **Filter not working** – filter CSVs are loaded at startup; restart the server after editing them.
- **PM2 won't start** – check `pm2 logs pyxis-flask-backend` for the error.
