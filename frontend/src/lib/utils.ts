import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function timeAgo(timestamp: Date | string | number): string {
export function timeAgo(
  timestamp: Date | string | number,
  locale: string = "ru",
): string {
  const now = new Date();
  const past = new Date(timestamp);
  const elapsedMs = past.getTime() - now.getTime();
  // Разница в миллисекундах (отрицательная, так как это прошлое)

  // Инициализируем встроенный локализатор времени браузера
  const rtf = new Intl.RelativeTimeFormat(locale, {
    style: "long",
    numeric: "always",
  });

  // Структура интервалов для расчета
  const intervals: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: "year", ms: 31536000000 },
    { unit: "month", ms: 2592000000 },
    { unit: "day", ms: 86400000 },
    { unit: "hour", ms: 3600000 },
    { unit: "minute", ms: 60000 },
  ];

  // Ищем подходящий интервал
  for (const { unit, ms } of intervals) {
    if (Math.abs(elapsedMs) >= ms) {
      const count = Math.round(elapsedMs / ms);
      return rtf.format(count, unit); // Браузер сам соберет: "3 дня назад"
      // или "3 days ago"
    }
  }

  // Если прошло меньше минуты
  return locale === "ru" ? "только что" : "just now";

  // const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // const intervals = {
  //   year: 31536000,
  //   month: 2592000,
  //   week: 604800,
  //   day: 86400,
  //   hour: 3600,
  //   minute: 60,
  // };

  // for (const [unit, secondsInUnit] of Object.entries(intervals)) {
  //   const count = Math.floor(seconds / secondsInUnit);
  //   if (count >= 1) {
  //     return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  //   }
  // }

  // return "just now";
}

export function generateRandomString(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const CURRENT_YEAR = new Date().getFullYear();
