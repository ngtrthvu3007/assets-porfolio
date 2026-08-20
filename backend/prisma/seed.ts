import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? '' }),
});

const ASSET_TYPES = {
  crypto: 'crypto',
  etf: 'etf',
  gold: 'gold',
} as const;

interface SourceSeed {
  code: string;
  name: string;
}

interface AssetSeed {
  name: string;
  symbol: string;
  type: (typeof ASSET_TYPES)[keyof typeof ASSET_TYPES];
}

const sources: SourceSeed[] = [
  {
    code: process.env.GOLD_SOURCE_1_SOURCE_CODE ?? 'gold-provider-a',
    name: process.env.GOLD_SOURCE_1_SOURCE_NAME ?? 'Gold Provider A',
  },
  {
    code: process.env.GOLD_SOURCE_2_SOURCE_CODE ?? 'gold-provider-b',
    name: process.env.GOLD_SOURCE_2_SOURCE_NAME ?? 'Gold Provider B',
  },
  {
    code: process.env.GOLD_SOURCE_3_SOURCE_CODE ?? 'gold-provider-c',
    name: process.env.GOLD_SOURCE_3_SOURCE_NAME ?? 'Gold Provider C',
  },
];

const assets: AssetSeed[] = [
  { name: 'Vàng Thế Giới (XAU/USD)', symbol: 'XAUUSD', type: ASSET_TYPES.gold },
  { name: 'SJC 9999', symbol: 'SJL1L10', type: ASSET_TYPES.gold },
  { name: 'Nhẫn SJC', symbol: 'SJ9999', type: ASSET_TYPES.gold },
  { name: 'DOJI Hà Nội', symbol: 'DOHNL', type: ASSET_TYPES.gold },
  { name: 'DOJI HCM', symbol: 'DOHCML', type: ASSET_TYPES.gold },
  { name: 'DOJI Nữ Trang', symbol: 'DOJINHTV', type: ASSET_TYPES.gold },
  { name: 'Bảo Tín SJC', symbol: 'BTSJC', type: ASSET_TYPES.gold },
  { name: 'Bảo Tín 9999', symbol: 'BT9999NTT', type: ASSET_TYPES.gold },
  { name: 'PNJ Hà Nội', symbol: 'PQHNVM', type: ASSET_TYPES.gold },
  { name: 'PNJ 24K', symbol: 'PQHN24NTT', type: ASSET_TYPES.gold },
  { name: 'VN Gold SJC', symbol: 'VNGSJC', type: ASSET_TYPES.gold },
  { name: 'Viettin SJC', symbol: 'VIETTINMSJC', type: ASSET_TYPES.gold },
  { name: 'Mi Hồng 999', symbol: 'MH999', type: ASSET_TYPES.gold },
  { name: 'Mi Hồng 985', symbol: 'MH985', type: ASSET_TYPES.gold },
  { name: 'Mi Hồng 980', symbol: 'MH980', type: ASSET_TYPES.gold },
  { name: 'Mi Hồng 950', symbol: 'MH950', type: ASSET_TYPES.gold },
  { name: 'Kim Nga 99', symbol: 'KN99', type: ASSET_TYPES.gold },
  { name: 'Kim Nga 999', symbol: 'KN999', type: ASSET_TYPES.gold },
  { name: 'Kim Nga 9999', symbol: 'KN9999', type: ASSET_TYPES.gold },
];

const seedSources = () => {
  return Promise.all(
    sources.map((source) =>
      prisma.marketDataSource.upsert({
        create: source,
        update: {
          deletedAt: null,
          name: source.name,
        },
        where: { code: source.code },
      }),
    ),
  );
};

const seedAssets = () => {
  return Promise.all(
    assets.map((asset) =>
      prisma.asset.upsert({
        create: asset,
        update: {
          deletedAt: null,
          name: asset.name,
          type: asset.type,
        },
        where: { symbol: asset.symbol },
      }),
    ),
  );
};

const main = async () => {
  await seedSources();
  await seedAssets();
};

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
