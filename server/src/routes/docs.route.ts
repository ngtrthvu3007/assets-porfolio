import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../docs/openapi.js";

export const docsRouter = Router();

docsRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

docsRouter.get("/docs.json", (_request, response) => {
  response.json(openApiSpec);
});
