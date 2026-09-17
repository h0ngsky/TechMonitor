import { fetchFeedXml, parseFeed, type ParsedItem } from "@/lib/rss";
import { NEWS_SOURCES, type NewsCategory } from "@/lib/sources";

export type NewsItem = ParsedItem & {
  id: string;
  sourceId: string;
  sourceName: string;
  category: NewsCategory;
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

const FEED_TIMEOUT_MS = 9000;
const MAX_ITEMS = 90;
const MAX_PER_SOURCE = 12;

declare global {
  var __newsMonitorSnapshot: ScanSnapshot | undefined;
}

function hashId(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

async function scanSource(source: (typeof NEWS_SOURCES)[number]): Promise<{
  result: SourceScanResult;
  items: NewsItem[];
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const xml = await fetchFeedXml(source.feedUrl, controller.signal);
    const parsed = parseFeed(xml).slice(0, MAX_PER_SOURCE);
    const items: NewsItem[] = parsed.map((item) => ({
      ...item,
      id: hashId(`${source.id}:${item.link}`),
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
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

export async function runNewsScan(): Promise<ScanSnapshot> {
  const settled = await Promise.all(NEWS_SOURCES.map((source) => scanSource(source)));
  const sources = settled.map((entry) => entry.result);
  const items = dedupe(settled.flatMap((entry) => entry.items))
    .sort((a, b) => {
      const hasImage = Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl));
      if (hasImage !== 0) return hasImage;
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    })
    .slice(0, MAX_ITEMS);

  const snapshot: ScanSnapshot = {
    scannedAt: new Date().toISOString(),
    itemCount: items.length,
    sourceCount: sources.length,
    okSourceCount: sources.filter((s) => s.ok).length,
    failedSourceCount: sources.filter((s) => !s.ok).length,
    sources,
    items,
  };

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
  return runNewsScan();
}
