import "dotenv/config";
import { DEFAULT_CLIENT_ORIGIN, DEFAULT_PORT } from "../constants/env.js";

interface EnvConfig {
  clientOrigin: string;
  port: number;
}

export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing ${key}`);
  }

  return value;
};

export const parseNumberEnv = (
  value: string | undefined,
  defaultValue: number,
): number => {
  if (!value) return defaultValue;

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export const envConfig: EnvConfig = {
  clientOrigin: process.env.CLIENT_ORIGIN ?? DEFAULT_CLIENT_ORIGIN,
  port: parseNumberEnv(process.env.PORT, DEFAULT_PORT),
};
