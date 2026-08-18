import { DEFAULT_COLLECTION_CRON } from '@shared/constants/market-data';
import { getRequiredEnv } from '@shared/utils/env.util';

export interface MarketDataApiSourceConfig {
  actionKey: string;
  actionValue: string;
  baseUrl: string;
  cronExpression: string;
  path: string;
  source: string;
}

export const loadMarketDataApiSourceConfig = (
  envPrefix: string,
): MarketDataApiSourceConfig => ({
  actionKey: getRequiredEnv(`${envPrefix}_API_ACTION_KEY`),
  actionValue: getRequiredEnv(`${envPrefix}_API_ACTION_VALUE`),
  baseUrl: getRequiredEnv(`${envPrefix}_API_BASE_URL`),
  cronExpression:
    process.env[`${envPrefix}_COLLECTION_CRON`] ?? DEFAULT_COLLECTION_CRON,
  path: getRequiredEnv(`${envPrefix}_API_PATH`),
  source: getRequiredEnv(`${envPrefix}_SOURCE_CODE`),
});
