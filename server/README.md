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

- `success` when raw source data is collected and new quote points are stored
- `no_change` when raw source data is collected but the provider version already exists
- `failed` when the collector cannot retrieve raw source data

After a successful raw collect, the server checks whether the same
`sourceId` and provider `sourceUpdatedAt` was already ingested. New provider
versions are stored in `MarketQuote`; unchanged provider data is recorded as a
`no_change` ingestion.
`MarketDataIngestion.sourceUpdatedAt` stores the provider update timestamp for
the collect result, so monitoring can see which provider data version was read.

```mermaid
flowchart TD
  A[Scheduler or API trigger] --> B[Find collector by source]
  B --> C[collector.collect]
  C -->|failed| D[Create MarketDataIngestion failed]
  D --> E[Return null]
  C -->|success| F[Read provider sourceUpdatedAt from result]
  F --> G[Find existing ingestion by sourceUpdatedAt]
  G -->|exists| I[Create MarketDataIngestion no_change]
  I --> J[Return collection result]
  G -->|none| K[Create MarketDataIngestion success]
  K --> L[Resolve seeded assets by quote symbols]
  L --> M[Create MarketQuote rows with createMany]
  M --> J
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
