# Backend

NestJS monorepo for backend applications.

## Structure

```txt
apps/
  api/        # HTTP API gateway, Swagger, request validation
  collector/  # scheduled market data worker
libs/
  database/   # Prisma module and Prisma service
  shared/     # shared constants, types, pure utils
prisma/       # schema, migrations, seed
```

## Commands

```bash
npm run start:dev          # API gateway
npm run start:collector    # collector worker
npm run build              # API gateway build
npm run build:collector    # collector build
```

## Environment

```bash
cp .env.example .env
```

Required variables:

```txt
PORT
CLIENT_ORIGIN
DATABASE_URL
MARKET_DATA_COLLECTION_CRON
MARKET_DATA_SOURCE_CODE
MARKET_DATA_SOURCE_NAME
MARKET_DATA_API_BASE_URL
MARKET_DATA_API_PATH
MARKET_DATA_API_ACTION_KEY
MARKET_DATA_API_ACTION_VALUE
```

## Prisma

Create a migration file without applying it:

```bash
npm run prisma:migrate:create -- <migration_name>
```

Then review generated SQL before running:

```bash
npm run prisma:generate
npm run build
npm run build:collector
npm run prisma:migrate
```

Seed data:

```bash
npm run prisma:seed
```
