import type { NewsCategory } from "@/lib/sources";

export type Locale = "zh" | "en";

export const LOCALE_STORAGE_KEY = "monitor-locale";

export const CATEGORY_LABELS_I18N: Record<
  Locale,
  Record<NewsCategory, string>
> = {
  zh: {
    tech: "科技",
    ai: "AI",
    finance: "金融",
    health: "健康",
  },
  en: {
    tech: "Tech",
    ai: "AI",
    finance: "Finance",
    health: "Health",
  },
};

type Messages = {
  tagline: string;
  scanning: string;
  standby: string;
  next: string;
  scanNow: string;
  scanningBtn: string;
  lastScan: string;
  stories: string;
  sources: string;
  search: string;
  searchAria: string;
  scanFailed: string;
  retry: string;
  scanningEllipsis: string;
  emptyBoard: string;
  scanErrorFallback: string;
  timeUnknown: string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
  today: string;
  tomorrow: string;
  langAria: string;
};

export const MESSAGES: Record<Locale, Messages> = {
  zh: {
    tagline: "科技 / AI / 金融 / 健康",
    scanning: "值守中",
    standby: "窗口外",
    next: "下次巡检",
    scanNow: "立即巡检",
    scanningBtn: "巡检中…",
    lastScan: "最近",
    stories: "稿件",
    sources: "源站",
    search: "搜索…",
    searchAria: "搜索新闻",
    scanFailed: "巡检失败",
    retry: "重试",
    scanningEllipsis: "正在巡检…",
    emptyBoard: "暂无稿件",
    scanErrorFallback: "无法完成巡检",
    timeUnknown: "时间未知",
    justNow: "刚刚",
    minutesAgo: (n) => `${n} 分钟前`,
    hoursAgo: (n) => `${n} 小时前`,
    daysAgo: (n) => `${n} 天前`,
    today: "今天",
    tomorrow: "明天",
    langAria: "切换语言",
  },
  en: {
    tagline: "Tech / AI / Finance / Health",
    scanning: "On duty",
    standby: "Off hours",
    next: "Next scan",
    scanNow: "Scan now",
    scanningBtn: "Scanning…",
    lastScan: "Last",
    stories: "Stories",
    sources: "Sources",
    search: "Search…",
    searchAria: "Search news",
    scanFailed: "Scan failed",
    retry: "Retry",
    scanningEllipsis: "Scanning…",
    emptyBoard: "No stories yet",
    scanErrorFallback: "Unable to complete scan",
    timeUnknown: "Unknown time",
    justNow: "Just now",
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
    today: "Today",
    tomorrow: "Tomorrow",
    langAria: "Switch language",
  },
};

export function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en";
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore quota / private mode
  }
}

export function relativeTime(iso: string | null, locale: Locale) {
  const t = MESSAGES[locale];
  if (!iso) return t.timeUnknown;
  const delta = Date.now() - Date.parse(iso);
  const minutes = Math.max(0, Math.round(delta / 60000));
  if (minutes < 1) return t.justNow;
  if (minutes < 60) return t.minutesAgo(minutes);
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t.hoursAgo(hours);
  return t.daysAgo(Math.round(hours / 24));
}

export function intlLocale(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en-US";
}

export function needsTranslation(text: string, to: Locale) {
  const sample = text.slice(0, 120);
  const hasCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(sample);
  const latin = sample.replace(/[^A-Za-z]/g, "").length;
  if (to === "zh") return !hasCjk && latin >= 8;
  return hasCjk;
}
