import { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ListPricesQuery } from "../dtos/prices.dto.js";
import { validateListPricesQuery } from "../middleware/prices.middleware.js";
import {
  getPriceDetailController,
  getPricesController,
  getPriceTypesController,
} from "../modules/prices/prices.controller.js";
import { withResponse } from "../utils/withResponse.js";

export const pricesRouter = Router();

pricesRouter.get("/prices/types", withResponse(getPriceTypesController));
pricesRouter.get("/prices/:type/:symbol", withResponse(getPriceDetailController));
pricesRouter.get<ParamsDictionary, unknown, unknown, ListPricesQuery>(
  "/prices",
  validateListPricesQuery,
  withResponse(getPricesController),
);
