import type { RequestHandler } from "express";
import { appError } from "./errorHandler.js";

export const validateListPricesQuery: RequestHandler = (
  request,
  _response,
  next,
) => {
  const { type } = request.query;

  if (typeof type === "string" && type.trim()) return next();

  throw appError(400, "PRICE_TYPE_REQUIRED", "type is required");
};
