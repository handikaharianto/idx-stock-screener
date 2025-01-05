import { format } from "date-fns";

export function formatNumber(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return sign + (absValue / 1_000_000_000_000).toFixed(1) + " T";
  } else if (absValue >= 1_000_000_000) {
    return sign + (absValue / 1_000_000_000).toFixed(1) + " B";
  } else if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(1) + " M";
  } else if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(1) + " K";
  } else {
    return sign + absValue.toString();
  }
}

export function capitalize(input: string): string {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function capitalizeWords(input: string): string {
  return input
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
}

export function formatDate(date: string, dateFormat: string): string {
  return format(new Date(date), dateFormat);
}
