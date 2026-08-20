import { DEFAULT_COLLECTION_CRON } from '@shared/constants/market-data';
import { getRequiredEnv } from '@shared/utils/env.util';

export interface GoldProviderASourceConfig {
  actionKey: string;
  actionValue: string;
  baseUrl: string;
  cronExpression: string;
  path: string;
  source: string;
}

export const loadGoldProviderASourceConfig = (
  envPrefix: string,
): GoldProviderASourceConfig => ({
  actionKey: getRequiredEnv(`${envPrefix}_API_ACTION_KEY`),
  actionValue: getRequiredEnv(`${envPrefix}_API_ACTION_VALUE`),
  baseUrl: getRequiredEnv(`${envPrefix}_API_BASE_URL`),
  cronExpression:
    process.env[`${envPrefix}_COLLECTION_CRON`] ?? DEFAULT_COLLECTION_CRON,
  path: getRequiredEnv(`${envPrefix}_API_PATH`),
  source: getRequiredEnv(`${envPrefix}_SOURCE_CODE`),
});
