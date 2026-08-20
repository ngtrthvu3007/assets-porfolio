import { DEFAULT_COLLECTION_CRON } from '@shared/constants/market-data';
import { getRequiredEnv } from '@shared/utils/env.util';

export interface GoldProviderCSourceConfig {
  baseUrl: string;
  cronExpression: string;
  source: string;
}

export const loadGoldProviderCSourceConfig = (
  envPrefix: string,
): GoldProviderCSourceConfig => ({
  baseUrl: getRequiredEnv(`${envPrefix}_API_BASE_URL`),
  cronExpression:
    process.env[`${envPrefix}_COLLECTION_CRON`] ?? DEFAULT_COLLECTION_CRON,
  source: getRequiredEnv(`${envPrefix}_SOURCE_CODE`),
});
