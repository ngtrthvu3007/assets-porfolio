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
  {
    name: "SJC",
    symbol: "SJC",
    type: ASSET_TYPES.gold,
  },
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
