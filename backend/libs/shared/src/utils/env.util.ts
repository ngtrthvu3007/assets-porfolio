export const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) throw new Error(`Missing ${key}`);

  return value;
};

export const parseNumberEnv = (
  value: string | undefined,
  defaultValue: number,
) => {
  if (!value) return defaultValue;

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};
