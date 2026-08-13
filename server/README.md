# Assets Portfolio Server

Express + TypeScript backend for collecting and storing market data.

## Database Setup

Create or update the local database:

```sh
npm run prisma:migrate
```

Seed required reference data:

```sh
npm run prisma:seed
```

The seed script creates market data sources and known assets used by ingestion.
Runtime ingestion does not create sources or assets automatically. If a collector
returns a new asset symbol, add it to `prisma/seed.ts` and run the seed script
again before collecting data for that symbol.

## Market Data Flow

Market data ingestion writes one `MarketDataIngestion` record for each collect
result:

- `success` when raw source data is collected
- `failed` when the collector cannot retrieve raw source data

After a successful raw collect, the server normalizes quote data and creates
`MarketQuote` records for seeded assets. Existing quotes with the same
`assetId`, `sourceId`, and `sourceUpdatedAt` are rejected by the database unique
constraint.

```mermaid
flowchart TD
  A[Scheduler or API trigger] --> B[Find collector by source]
  B --> C[collector.collect]
  C -->|failed| D[Create MarketDataIngestion failed]
  D --> E[Return null]
  C -->|success| F[Create MarketDataIngestion success with raw sourcePayload]
  F --> G[Resolve seeded assets by quote symbols]
  G --> H[Create MarketQuote rows with createMany]
  H --> I[Return collection result]
```

## Scripts

```sh
npm run dev
npm run typecheck
npm run build
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```
