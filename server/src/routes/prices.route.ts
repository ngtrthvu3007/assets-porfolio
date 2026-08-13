import { Router } from "express";
import { getPricesController } from "../modules/prices/prices.controller.js";
import { withResponse } from "../utils/withResponse.js";

export const pricesRouter = Router();

pricesRouter.get("/prices", withResponse(getPricesController));
