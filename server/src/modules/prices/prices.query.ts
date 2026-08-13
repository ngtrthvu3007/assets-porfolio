import { AppError } from "../../middleware/errorHandler.js";
import type { GetPricesQuery, PriceAction } from "./prices.types.js";

interface PricesRequestQuery {
  action?: unknown;
  days?: unknown;
  type?: unknown;
}

const parseStringQuery = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();

  return trimmedValue || null;
};

const parseAction = (value: unknown): PriceAction => {
  const action = parseStringQuery(value);

  if (!action) return "current";
  if (action === "current" || action === "summary") return action;

  throw new AppError(
    400,
    "INVALID_PRICE_ACTION",
    'action must be "current" or "summary"',
  );
};

const parseDays = (value: unknown): number | null => {
  if (value === undefined) return null;

  const days = Number(value);

  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new AppError(400, "INVALID_PRICE_DAYS", "days must be from 1 to 30");
  }

  return days;
};

export const parseGetPricesQuery = (
  query: PricesRequestQuery,
): GetPricesQuery => {
  const type = parseStringQuery(query.type);
  const days = parseDays(query.days);
  const action = parseAction(query.action);

  if (days && !type) {
    throw new AppError(
      400,
      "PRICE_TYPE_REQUIRED",
      "type is required when days is provided",
    );
  }

  return {
    action,
    days,
    type,
  };
};
