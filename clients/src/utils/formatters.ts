export const formatCurrency = (value: number): string => {
  return value.toLocaleString("vi-VN");
};

export const formatSignedCurrency = (value: number): string => {
  const formattedValue = formatCurrency(Math.abs(value));

  if (value > 0) return `+${formattedValue}`;
  if (value < 0) return `-${formattedValue}`;

  return "0";
};

export const formatUnixTimestamp = (timestamp: number | null): string => {
  if (!timestamp) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp * 1000));
};
