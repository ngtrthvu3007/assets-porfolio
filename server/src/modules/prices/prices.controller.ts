import type { Request } from "express";
import { parseGetPricesQuery } from "./prices.query.js";
import { getPrices } from "./prices.service.js";

export const getPricesController = (request: Request) => {
  return getPrices(parseGetPricesQuery(request.query));
};
