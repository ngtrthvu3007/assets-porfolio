import { AppError } from "../../middleware/errorHandler.js";
import type { GetPricesQuery } from "./prices.types.js";

interface PricesResponse {
  message: string;
  query: GetPricesQuery;
}

export const getPrices = (query: GetPricesQuery): PricesResponse => {
  throw new AppError(
    501,
    "PRICE_STORAGE_NOT_READY",
    `Price storage is not ready yet for ${query.type ? query.type : "all gold types"}`,
  );
};
