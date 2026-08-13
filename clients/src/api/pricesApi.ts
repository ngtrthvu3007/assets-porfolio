import { PRICES_ENDPOINT } from "../constants/prices";
import type { PriceQuery, PricesData, PricesResponse } from "../types/prices";
import { httpClient } from "./httpClient";

export const fetchPrices = async (
  params: PriceQuery = {},
): Promise<PricesData> => {
  const response = await httpClient.get<PricesResponse>(PRICES_ENDPOINT, {
    params,
  });

  return {
    currentTime: response.data.current_time,
    items: response.data.data,
  };
};
