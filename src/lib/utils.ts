import { ERRAND_TYPES, DAY_OPTIONS } from "./constants";
import type { ErrandType } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function errandLabel(type: ErrandType) {
  return ERRAND_TYPES.find((item) => item.value === type)?.label ?? type;
}

export function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function formatBaht(value: number | null | undefined) {
  if (value == null) return "ตามตกลง";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDays(days: string[]) {
  return days
    .map((day) => DAY_OPTIONS.find((item) => item.value === day)?.label ?? day)
    .join(", ");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
