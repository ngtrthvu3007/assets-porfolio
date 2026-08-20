import { DEFAULT_COLLECTION_CRON } from '@shared/constants/market-data';
import { getRequiredEnv } from '@shared/utils/env.util';

export interface GoldProviderBSourceConfig {
  assetNamePrefix: string;
  assetSymbolPrefix: string;
  baseUrl: string;
  cronExpression: string;
  source: string;
}

export const loadGoldProviderBSourceConfig = (
  envPrefix: string,
): GoldProviderBSourceConfig => ({
  assetNamePrefix: getRequiredEnv(`${envPrefix}_ASSET_NAME_PREFIX`),
  assetSymbolPrefix: getRequiredEnv(`${envPrefix}_ASSET_SYMBOL_PREFIX`),
  baseUrl: getRequiredEnv(`${envPrefix}_API_BASE_URL`),
  cronExpression:
    process.env[`${envPrefix}_COLLECTION_CRON`] ?? DEFAULT_COLLECTION_CRON,
  source: getRequiredEnv(`${envPrefix}_SOURCE_CODE`),
});
