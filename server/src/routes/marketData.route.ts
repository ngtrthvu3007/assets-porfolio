import { Router } from "express";
import { getLatestMarketDataController } from "../modules/market-data/marketData.controller.js";
import { withResponse } from "../utils/withResponse.js";

export const marketDataRouter = Router();

marketDataRouter.get("/latest", withResponse(getLatestMarketDataController));
