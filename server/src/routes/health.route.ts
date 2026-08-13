import { Router } from "express";
import { prisma } from "../libs/prisma.js";
import { withResponse } from "../utils/withResponse.js";

interface HealthResponse {
  database: "ok";
  status: "ok";
}

export const healthRouter = Router();

const getHealth = async (): Promise<HealthResponse> => {
  await prisma.$queryRaw`SELECT 1`;

  return {
    database: "ok",
    status: "ok",
  };
};

healthRouter.get("/", withResponse(getHealth));
