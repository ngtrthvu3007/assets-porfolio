import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import {
  API_BASE_PATH,
  DEFAULT_API_TIMEOUT_MS,
  GOLD_PRICE_DOMAIN,
} from "../constants/api";
import { useToast } from "../composables/useToast";
import type { ApiError } from "../types/api";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};

export const httpClient: AxiosInstance = axios.create({
  baseURL: GOLD_PRICE_DOMAIN ? `${GOLD_PRICE_DOMAIN}${API_BASE_PATH}` : undefined,
  timeout: DEFAULT_API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  if (!GOLD_PRICE_DOMAIN) {
    const apiError: ApiError = {
      message: "Missing required env: VITE_GOLE_PRICE_DOMAIN",
    };

    return Promise.reject(apiError);
  }

  if (!accessToken) return config;

  config.headers.set("Authorization", `Bearer ${accessToken}`);

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);

    showApiError(apiError);

    return Promise.reject(apiError);
  },
);

export const createRequestConfig = (
  config: AxiosRequestConfig = {},
): AxiosRequestConfig => ({
  ...config,
});

const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error;

  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : "Unexpected API error",
      details: error,
    };
  }

  const responseData = error.response?.data;

  if (isApiError(responseData)) {
    return {
      status: error.response?.status,
      message: responseData.message,
      details: responseData.details,
    };
  }

  return {
    status: error.response?.status,
    message: error.message || "Unexpected API error",
    details: responseData,
  };
};

const showApiError = (error: ApiError): void => {
  useToast().showErrorToast(error.message);
};

const isApiError = (
  value: unknown,
): value is Pick<ApiError, "message" | "details"> => {
  return Boolean(
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof value.message === "string",
  );
};
