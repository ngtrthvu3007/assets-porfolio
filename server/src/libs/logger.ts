const writeLog = (
  level: "error" | "info" | "warn",
  scope: string,
  message: string,
): void => {
  const payload = {
    scope,
    timestamp: new Date().toISOString(),
  };

  if (level === "error") console.error(message, payload);
  else if (level === "warn") console.warn(message, payload);
  else console.info(message, payload);
};

export const log = (scope: string, message: string): void => {
  writeLog("info", scope, message);
};

export const warn = (scope: string, message: string): void => {
  writeLog("warn", scope, message);
};

export const error = (scope: string, message: string): void => {
  writeLog("error", scope, message);
};
