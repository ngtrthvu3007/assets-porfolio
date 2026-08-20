import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DEFAULT_ISO_FORMAT, DEFAULT_LOCALE, DEFAULT_TIMEZONE } from "@/constants/default";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatCurrency = (value: number): string => {
  return value.toLocaleString(DEFAULT_LOCALE);
};

export const formatSignedCurrency = (value: number): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, { signDisplay: "exceptZero" }).format(value);
};

export const formatIsoTimestamp = (isoDate: string | null): string => {
  if (!isoDate) return "--";

  return dayjs(isoDate).tz(DEFAULT_TIMEZONE).format(DEFAULT_ISO_FORMAT);
};

export const formatIsoDate = (isoDate: string | null): string => {
  if (!isoDate) return "--";

  return dayjs(isoDate).tz(DEFAULT_TIMEZONE).format("DD/MM/YYYY");
};

export const formatCapitalLetter = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
