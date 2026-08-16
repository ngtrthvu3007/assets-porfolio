export const openApiSpec = {
  openapi: "3.0.3",
  info: { title: "Assets Portfolio API", version: "0.1.0" },
  paths: {
    "/api/prices/types": {
      get: {
        operationId: "listPriceTypes",
        responses: {
          "200": {
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PriceTypesSuccessResponse" } },
            },
            description: "Price types returned successfully",
          },
        },
        summary: "List available price tabs",
        tags: ["Prices"],
      },
    },
    "/api/prices": {
      get: {
        operationId: "listPrices",
        parameters: [
          { in: "query", name: "type", required: true, schema: { example: "gold", type: "string" } },
          { in: "query", name: "source", required: false, schema: { example: "vang.today", type: "string" } },
          { in: "query", name: "q", required: false, schema: { example: "SJC", type: "string" } },
          { in: "query", name: "page", required: false, schema: { default: 1, minimum: 1, type: "integer" } },
          {
            in: "query",
            name: "pageSize",
            required: false,
            schema: { default: 50, minimum: 1, type: "integer" },
          },
          {
            in: "query",
            name: "sort",
            required: false,
            schema: {
              default: "updatedAt",
              enum: ["symbol", "name", "updatedAt", "buyPrice", "sellPrice"],
              type: "string",
            },
          },
          {
            in: "query",
            name: "order",
            required: false,
            schema: { default: "desc", enum: ["asc", "desc"], type: "string" },
          },
        ],
        responses: {
          "200": {
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/PricesSuccessResponse" } },
            },
            description: "Prices returned successfully",
          },
          "400": {
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            description: "Invalid price query",
          },
        },
        summary: "List quotes by asset type",
        tags: ["Prices"],
      },
    },
    "/api/prices/{type}/{symbol}": {
      get: {
        operationId: "getPriceDetail",
        parameters: [
          { in: "path", name: "type", required: true, schema: { example: "gold", type: "string" } },
          { in: "path", name: "symbol", required: true, schema: { example: "SJL1L10", type: "string" } },
          {
            in: "query",
            name: "days",
            required: false,
            schema: { example: 30, maximum: 30, minimum: 1, type: "integer" },
          },
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PriceDetailSuccessResponse" },
              },
            },
            description: "Price detail returned successfully",
          },
          "404": {
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            description: "Price not found",
          },
        },
        summary: "Get price detail by asset type and symbol",
        tags: ["Prices"],
      },
    },
  },
  components: {
    schemas: {
      Asset: {
        properties: {
          name: { example: "SJC 9999", type: "string" },
          symbol: { example: "SJL1L10", type: "string" },
          type: { example: "gold", type: "string" },
        },
        required: ["name", "symbol", "type"],
        type: "object",
      },
      ErrorResponse: {
        properties: {
          error: {
            properties: {
              code: { example: "PRICE_TYPE_REQUIRED", type: "string" },
              message: { example: "type is required", type: "string" },
            },
            required: ["code", "message"],
            type: "object",
          },
          success: { example: false, type: "boolean" },
        },
        required: ["error", "success"],
        type: "object",
      },
      PriceDetailSuccessResponse: {
        properties: {
          data: {
            properties: {
              asset: { $ref: "#/components/schemas/Asset" },
              history: { items: { $ref: "#/components/schemas/PriceHistoryItem" }, type: "array" },
              latest: { $ref: "#/components/schemas/PriceSnapshot" },
              source: { $ref: "#/components/schemas/PriceSource" },
            },
            required: ["asset", "history", "latest", "source"],
            type: "object",
          },
          success: { example: true, type: "boolean" },
        },
        required: ["data", "success"],
        type: "object",
      },
      PriceHistoryItem: {
        properties: {
          buyPrice: { nullable: true, type: "number" },
          collectedAt: { format: "date-time", type: "string" },
          sellPrice: { nullable: true, type: "number" },
          sourceUpdatedAt: { format: "date-time", type: "string" },
        },
        required: ["buyPrice", "collectedAt", "sellPrice", "sourceUpdatedAt"],
        type: "object",
      },
      PriceItem: {
        properties: {
          asset: { $ref: "#/components/schemas/Asset" },
          buyChange: { nullable: true, type: "number" },
          buyPrice: { nullable: true, type: "number" },
          collectedAt: { format: "date-time", type: "string" },
          sellChange: { nullable: true, type: "number" },
          sellPrice: { nullable: true, type: "number" },
          sourceUpdatedAt: { format: "date-time", type: "string" },
        },
        required: [
          "asset",
          "buyChange",
          "buyPrice",
          "collectedAt",
          "sellChange",
          "sellPrice",
          "sourceUpdatedAt",
        ],
        type: "object",
      },
      PricesPagination: {
        properties: {
          page: { example: 1, type: "integer" },
          pageSize: { example: 50, type: "integer" },
          total: { example: 120, type: "integer" },
          totalPages: { example: 3, type: "integer" },
        },
        required: ["page", "pageSize", "total", "totalPages"],
        type: "object",
      },
      PricesSuccessResponse: {
        properties: {
          data: {
            properties: {
              currentTime: { format: "date-time", type: "string" },
              items: { items: { $ref: "#/components/schemas/PriceItem" }, type: "array" },
              pagination: { $ref: "#/components/schemas/PricesPagination" },
              type: { example: "gold", type: "string" },
            },
            required: ["currentTime", "items", "pagination", "type"],
            type: "object",
          },
          success: { example: true, type: "boolean" },
        },
        required: ["data", "success"],
        type: "object",
      },
      PriceSnapshot: {
        allOf: [
          { $ref: "#/components/schemas/PriceHistoryItem" },
          {
            properties: {
              buyChange: { nullable: true, type: "number" },
              sellChange: { nullable: true, type: "number" },
            },
            required: ["buyChange", "sellChange"],
            type: "object",
          },
        ],
      },
      PriceSource: {
        properties: {
          code: { example: "vang.today", type: "string" },
          name: { example: "vang.today", type: "string" },
        },
        required: ["code", "name"],
        type: "object",
      },
      PriceType: {
        properties: {
          label: { example: "Gold", type: "string" },
          type: { example: "gold", type: "string" },
        },
        required: ["label", "type"],
        type: "object",
      },
      PriceTypesSuccessResponse: {
        properties: {
          data: {
            properties: { items: { items: { $ref: "#/components/schemas/PriceType" }, type: "array" } },
            required: ["items"],
            type: "object",
          },
          success: { example: true, type: "boolean" },
        },
        required: ["data", "success"],
        type: "object",
      },
    },
  },
  tags: [{ name: "Prices" }],
} as const;
