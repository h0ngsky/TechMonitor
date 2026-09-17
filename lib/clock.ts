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
) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: MONITOR_TZ, ...options }).format(date);
}

export function isInScanWindow(date = new Date()) {
  const { hour, minute } = getClockParts(date);
  const minutes = hour * 60 + minute;
  return minutes >= WINDOW_START_MINUTES && minutes <= WINDOW_END_MINUTES;
}

export function nextScanAt(date = new Date()) {
  const parts = getClockParts(date);
  const minutes = parts.hour * 60 + parts.minute;

  if (minutes > WINDOW_END_MINUTES) {
    return "明天 09:00";
  }

  if (minutes < WINDOW_START_MINUTES) {
    return "今天 09:00";
  }

  const remainder = parts.minute % 30;
  const add = remainder === 0 && parts.second === 0 ? 30 : 30 - remainder;
  const nextTotal = minutes + add;
  if (nextTotal > WINDOW_END_MINUTES) {
    return "明天 09:00";
  }
  const h = Math.floor(nextTotal / 60)
    .toString()
    .padStart(2, "0");
  const m = (nextTotal % 60).toString().padStart(2, "0");
  return `今天 ${h}:${m}`;
}

export function windowCopy() {
  return "每天 09:00–20:00（北京时间），每 30 分钟巡检一次";
}
