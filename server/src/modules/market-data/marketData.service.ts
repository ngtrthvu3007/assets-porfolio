import { appError } from "../../middleware/errorHandler.js";

interface LatestMarketDataResponse {
  message: string;
}

export const getLatestMarketData = (): LatestMarketDataResponse => {
  throw appError(501, "MARKET_DATA_STORAGE_NOT_READY", "Market data storage is not ready yet");
};
