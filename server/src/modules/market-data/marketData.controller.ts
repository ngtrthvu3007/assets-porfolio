import { getLatestMarketData } from "./marketData.service.js";

interface LatestMarketDataResponse {
  message: string;
}

export const getLatestMarketDataController = (): LatestMarketDataResponse => {
  return getLatestMarketData();
};
