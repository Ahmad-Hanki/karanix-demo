import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  dateString: string,
  type?:
    | "only-year"
    | "month-year"
    | "full-date"
    | "full-date-time"
    | "hour-minute"
) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  if (type === "only-year") {
    return format(date, "yyyy");
  }

  if (type === "month-year") {
    return format(date, "MM.yyyy");
  }

  if (type === "full-date-time") {
    return format(date, "dd.MM.yyyy HH:mm");
  }

  if (type === "hour-minute") {
    return format(date, "HH:mm");
  }

  return format(date, "dd.MM.yyyy");
};
