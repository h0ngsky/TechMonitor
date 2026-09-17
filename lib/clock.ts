export const MONITOR_TZ = "Asia/Shanghai";
export const WINDOW_START_MINUTES = 9 * 60;
export const WINDOW_END_MINUTES = 20 * 60;

export type ClockParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
};

export function getClockParts(date = new Date(), timeZone = MONITOR_TZ): ClockParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });

  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }

  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour: Number(bag.hour),
    minute: Number(bag.minute),
    second: Number(bag.second),
    weekday: bag.weekday,
  };
}

export function formatInZone(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
  locale: string = "zh-CN",
) {
  return new Intl.DateTimeFormat(locale, { timeZone: MONITOR_TZ, ...options }).format(date);
}

export function isInScanWindow(date = new Date()) {
  const { hour, minute } = getClockParts(date);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;
  const minutes = hour * 60 + minute;
  return minutes >= WINDOW_START_MINUTES && minutes <= WINDOW_END_MINUTES;
}

export function nextScanAt(
  date = new Date(),
  labels: { today: string; tomorrow: string } = {
    today: "今天",
    tomorrow: "明天",
  },
) {
  const parts = getClockParts(date);
  const hour = Number.isFinite(parts.hour) ? parts.hour : 0;
  const minute = Number.isFinite(parts.minute) ? parts.minute : 0;
  const second = Number.isFinite(parts.second) ? parts.second : 0;
  const minutes = hour * 60 + minute;

  if (minutes > WINDOW_END_MINUTES) {
    return `${labels.tomorrow} 09:00`;
  }

  if (minutes < WINDOW_START_MINUTES) {
    return `${labels.today} 09:00`;
  }

  // Align to the next 15-minute mark (cron cadence).
  const remainder = minute % 15;
  const add = remainder === 0 && second === 0 ? 15 : 15 - remainder;
  const nextTotal = minutes + add;
  if (nextTotal > WINDOW_END_MINUTES) {
    return `${labels.tomorrow} 09:00`;
  }
  const h = Math.floor(nextTotal / 60)
    .toString()
    .padStart(2, "0");
  const m = (nextTotal % 60).toString().padStart(2, "0");
  return `${labels.today} ${h}:${m}`;
}

export function windowCopy(locale: "zh" | "en" = "zh") {
  return locale === "en"
    ? "Daily 09:00–20:00 (Beijing time), every 15 minutes"
    : "每天 09:00–20:00（北京时间），每 15 分钟巡检一次";
}
