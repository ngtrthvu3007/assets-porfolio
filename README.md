# Assets Portfolio

Assets Portfolio is a small full-stack project for tracking asset prices and portfolio-related market data.

The app is split into a Vue + TypeScript client and an Express + TypeScript server. The client provides the portfolio and market price experience, while the server handles data collection, persistence, and API boundaries.

The current focus is building a reliable market data pipeline first:

- Seed known data sources and assets
- Collect raw payloads from external market data providers
- Store each collection attempt in `MarketDataIngestion` for monitoring
- Convert collected quotes into `MarketQuote` records
- Keep historical price points by asset, source, and source update time

The first supported data source is `vang.today`, used for gold price collection. The data model is designed so more sources and asset types can be added later without changing the ingestion history flow.

## Tech Stack

- Frontend: Vue, TypeScript, Vite, Tailwind CSS
- Backend: Express, TypeScript, Prisma
- Database: SQLite for local development

## Project Layout

```txt
clients/  Frontend app
server/   Backend API, Prisma schema, market data ingestion
```

More detailed notes live in each app folder:

- `clients/README.md`
- `server/README.md`
