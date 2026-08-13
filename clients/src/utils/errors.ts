import type { ApiError } from "../types/api";

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;

  return "Could not load prices";
};

const isApiError = (error: unknown): error is ApiError => {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string",
  );
};
