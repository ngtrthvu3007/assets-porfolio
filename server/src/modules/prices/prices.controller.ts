import type { Request } from "express";
import type { GetPricesRequest } from "../../dtos/prices.dto.js";
import {
  getPriceDetailService,
  listPricesService,
  listPriceTypesService,
} from "./prices.service.js";

export const getPricesController = (request: GetPricesRequest) => {
  const { order, page, pageSize, q, sort, source, type } = request.query;

  return listPricesService({ order, page, pageSize, q, sort, source, type });
};

export const getPriceTypesController = () => {
  return listPriceTypesService();
};

export const getPriceDetailController = (request: Request) => {
  const { symbol, type } = request.params;
  const days =
    typeof request.query.days === "string" ? Number(request.query.days) : null;

  return getPriceDetailService({ days, symbol, type });
};
