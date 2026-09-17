import { fetchFeedXml, parseFeed, type ParsedItem } from "@/lib/rss";
import { BOARD_ORDER, NEWS_SOURCES, type NewsCategory } from "@/lib/sources";
import { faviconForUrl, fetchOgImage } from "@/lib/og-image";
import { translateTexts } from "@/lib/translate";

export type NewsItem = ParsedItem & {
  id: string;
  sourceId: string;
  sourceName: string;
  category: NewsCategory;
  titleZh: string | null;
};

export type SourceScanResult = {
  sourceId: string;
  sourceName: string;
  category: NewsCategory;
  ok: boolean;
  itemCount: number;
  error?: string;
};

export type ScanSnapshot = {
  scannedAt: string;
  itemCount: number;
  sourceCount: number;
  okSourceCount: number;
  failedSourceCount: number;
  sources: SourceScanResult[];
  items: NewsItem[];
};

const FEED_TIMEOUT_MS = 5500;
const OG_TIMEOUT_MS = 3500;
const MAX_ITEMS = 120;
const MAX_PER_SOURCE = 8;
const MAX_PER_CATEGORY = 30;
const OG_CONCURRENCY = 8;

declare global {
  var __newsMonitorSnapshot: ScanSnapshot | undefined;
  var __newsMonitorScanPromise: Promise<ScanSnapshot> | undefined;
}

function hashId(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

const SPAM_TITLE =
  /\b(promo code|promo codes|coupon code|coupon codes|discount code|discount codes|% off|save up to|free trial)\b/i;

export function isSpamTitle(title: string) {
  return SPAM_TITLE.test(title);
}

async function scanSource(source: (typeof NEWS_SOURCES)[number]): Promise<{
  result: SourceScanResult;
  items: NewsItem[];
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const xml = await fetchFeedXml(source.feedUrl, controller.signal);
    const parsed = parseFeed(xml)
      .filter((item) => !isSpamTitle(item.title))
      .slice(0, MAX_PER_SOURCE);
    const items: NewsItem[] = parsed.map((item) => ({
      ...item,
      id: hashId(`${source.id}:${item.link}`),
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      titleZh: null,
    }));
    return {
      result: {
        sourceId: source.id,
        sourceName: source.name,
        category: source.category,
        ok: true,
        itemCount: items.length,
      },
      items,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "超时"
          : error.message
        : "未知错误";
    return {
      result: {
        sourceId: source.id,
        sourceName: source.name,
        category: source.category,
        ok: false,
        itemCount: 0,
        error: message,
      },
      items: [],
    };
  } finally {
    clearTimeout(timer);
  }
}

function dedupe(items: NewsItem[]) {
  const seen = new Set<string>();
  const unique: NewsItem[] = [];
  for (const item of items) {
    const key = item.title.replace(/\s+/g, "").toLowerCase().slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

function byRecency(a: NewsItem, b: NewsItem) {
  const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
  const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
  return tb - ta;
}

/** Fair mix: round-robin across sources inside each category. */
function diversify(items: NewsItem[]) {
  const picked: NewsItem[] = [];
  for (const category of BOARD_ORDER) {
    const pool = items.filter((item) => item.category === category).sort(byRecency);
    const bySource = new Map<string, NewsItem[]>();
    for (const item of pool) {
      const list = bySource.get(item.sourceId) ?? [];
      list.push(item);
      bySource.set(item.sourceId, list);
    }
    const queues = [...bySource.values()];
    let added = 0;
    let index = 0;
    while (added < MAX_PER_CATEGORY && queues.some((q) => q.length > 0)) {
      const queue = queues[index % queues.length];
      index += 1;
      if (!queue.length) continue;
      picked.push(queue.shift()!);
      added += 1;
    }
  }
  return picked.slice(0, MAX_ITEMS);
}

async function enrichImages(items: NewsItem[]) {
  const missing = items.filter((item) => !item.imageUrl);
  let cursor = 0;

  async function worker() {
    while (cursor < missing.length) {
      const current = missing[cursor];
      cursor += 1;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), OG_TIMEOUT_MS);
      try {
        const og = await fetchOgImage(current.link, controller.signal);
        if (og) {
          current.imageUrl = og;
          continue;
        }
      } catch {
        // fall through to favicon
      } finally {
        clearTimeout(timer);
      }
      current.imageUrl = faviconForUrl(current.sourcePageUrl || current.link);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(OG_CONCURRENCY, Math.max(missing.length, 1)) }, () =>
      worker(),
    ),
  );

  for (const item of items) {
    if (!item.imageUrl) item.imageUrl = faviconForUrl(item.sourcePageUrl || item.link);
  }
  return items;
}

async function enrichTranslations(items: NewsItem[]) {
  const titles = items.map((item) => item.title);
  try {
    const translated = await translateTexts(titles, "zh");
    items.forEach((item, index) => {
      const zh = translated[index]?.trim();
      item.titleZh = zh && zh !== item.title ? zh : /[\u3400-\u9fff]/.test(item.title) ? item.title : null;
    });
  } catch {
    for (const item of items) {
      item.titleZh = /[\u3400-\u9fff]/.test(item.title) ? item.title : null;
    }
  }
  return items;
}

export async function runNewsScan(): Promise<ScanSnapshot> {
  const settled = await Promise.all(NEWS_SOURCES.map((source) => scanSource(source)));
  const sources = settled.map((entry) => entry.result);
  const mixed = diversify(dedupe(settled.flatMap((entry) => entry.items)));
  const withImages = await enrichImages(mixed);
  const items = await enrichTranslations(withImages);

  const snapshot: ScanSnapshot = {
    scannedAt: new Date().toISOString(),
    itemCount: items.length,
    sourceCount: sources.length,
    okSourceCount: sources.filter((s) => s.ok).length,
    failedSourceCount: sources.filter((s) => !s.ok).length,
    sources,
    items,
  };

  const previous = globalThis.__newsMonitorSnapshot;
  if (snapshot.itemCount === 0 && previous && previous.itemCount > 0) {
    return previous;
  }

  globalThis.__newsMonitorSnapshot = snapshot;
  return snapshot;
}

export function getCachedSnapshot() {
  return globalThis.__newsMonitorSnapshot;
}

export async function getLatestSnapshot(force = false) {
  if (!force && globalThis.__newsMonitorSnapshot) {
    const age = Date.now() - Date.parse(globalThis.__newsMonitorSnapshot.scannedAt);
    if (age < 12 * 60 * 1000) return globalThis.__newsMonitorSnapshot;
  }

  if (globalThis.__newsMonitorScanPromise) {
    return globalThis.__newsMonitorScanPromise;
  }

  const previous = globalThis.__newsMonitorSnapshot;
  const scan = runNewsScan().finally(() => {
    globalThis.__newsMonitorScanPromise = undefined;
  });
  globalThis.__newsMonitorScanPromise = scan;

  try {
    return await scan;
  } catch {
    if (previous && previous.itemCount > 0) return previous;
    throw new Error("巡检失败");
  }
}
