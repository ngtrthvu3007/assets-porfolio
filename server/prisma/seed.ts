import { PrismaClient } from "@prisma/client";
import { ASSET_TYPES, type AssetType } from "../src/types/assets.js";

const prisma = new PrismaClient();

interface SourceSeed {
  code: string;
  name: string;
}

interface AssetSeed {
  name: string;
  symbol: string;
  type: AssetType;
}

const sources: SourceSeed[] = [
  {
    code: "vang.today",
    name: "vang.today",
  },
];

const assets: AssetSeed[] = [
  { name: "Vàng Thế Giới (XAU/USD)", symbol: "XAUUSD", type: ASSET_TYPES.gold },
  { name: "SJC 9999", symbol: "SJL1L10", type: ASSET_TYPES.gold },
  { name: "Nhẫn SJC", symbol: "SJ9999", type: ASSET_TYPES.gold },
  { name: "DOJI Hà Nội", symbol: "DOHNL", type: ASSET_TYPES.gold },
  { name: "DOJI HCM", symbol: "DOHCML", type: ASSET_TYPES.gold },
  { name: "DOJI Nữ Trang", symbol: "DOJINHTV", type: ASSET_TYPES.gold },
  { name: "Bảo Tín SJC", symbol: "BTSJC", type: ASSET_TYPES.gold },
  { name: "Bảo Tín 9999", symbol: "BT9999NTT", type: ASSET_TYPES.gold },
  { name: "PNJ Hà Nội", symbol: "PQHNVM", type: ASSET_TYPES.gold },
  { name: "PNJ 24K", symbol: "PQHN24NTT", type: ASSET_TYPES.gold },
  { name: "VN Gold SJC", symbol: "VNGSJC", type: ASSET_TYPES.gold },
  { name: "Viettin SJC", symbol: "VIETTINMSJC", type: ASSET_TYPES.gold },
];

const seedSources = async (): Promise<void> => {
  for (const source of sources) {
    await prisma.marketDataSource.upsert({
      create: source,
      update: {
        deletedAt: null,
        name: source.name,
      },
      where: { code: source.code },
    });
  }
};

const seedAssets = async (): Promise<void> => {
  for (const asset of assets) {
    await prisma.asset.upsert({
      create: asset,
      update: {
        deletedAt: null,
        name: asset.name,
        type: asset.type,
      },
      where: { symbol: asset.symbol },
    });
  }
};

const main = async (): Promise<void> => {
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
