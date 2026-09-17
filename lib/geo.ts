import type { NewsCategory } from "@/lib/sources";
import type { NewsItem } from "@/lib/scan";

export type GeoHub = {
  id: string;
  city: string;
  cityZh: string;
  region: string;
  regionZh: string;
  location: [number, number]; // [lat, lng]
};

/** Newsrooms / coverage hubs used to place stories on the globe. */
export const GEO_HUBS: Record<string, GeoHub> = {
  "san-francisco": {
    id: "san-francisco",
    city: "San Francisco",
    cityZh: "旧金山",
    region: "West Coast",
    regionZh: "美国西岸",
    location: [37.77, -122.42],
  },
  "new-york": {
    id: "new-york",
    city: "New York",
    cityZh: "纽约",
    region: "East Coast",
    regionZh: "美国东岸",
    location: [40.71, -74.01],
  },
  london: {
    id: "london",
    city: "London",
    cityZh: "伦敦",
    region: "Europe",
    regionZh: "欧洲",
    location: [51.51, -0.13],
  },
  boston: {
    id: "boston",
    city: "Boston",
    cityZh: "波士顿",
    region: "East Coast",
    regionZh: "美国东岸",
    location: [42.36, -71.06],
  },
  beijing: {
    id: "beijing",
    city: "Beijing",
    cityZh: "北京",
    region: "Asia",
    regionZh: "亚洲",
    location: [39.9, 116.4],
  },
  singapore: {
    id: "singapore",
    city: "Singapore",
    cityZh: "新加坡",
    region: "Asia",
    regionZh: "亚洲",
    location: [1.35, 103.82],
  },
  tokyo: {
    id: "tokyo",
    city: "Tokyo",
    cityZh: "东京",
    region: "Asia",
    regionZh: "亚洲",
    location: [35.68, 139.69],
  },
  "hong-kong": {
    id: "hong-kong",
    city: "Hong Kong",
    cityZh: "香港",
    region: "Asia",
    regionZh: "亚洲",
    location: [22.32, 114.17],
  },
};

const SOURCE_HUB: Record<string, string> = {
  techcrunch: "san-francisco",
  "the-verge": "new-york",
  wired: "san-francisco",
  engadget: "san-francisco",
  "bbc-tech": "london",
  "nyt-tech": "new-york",
  "guardian-tech": "london",
  "google-wsj-tech": "new-york",
  "google-reuters-tech": "london",
  "mit-tr": "boston",
  "ars-ai": "new-york",
  "google-ai": "san-francisco",
  "google-nyt-ai": "new-york",
  "google-bloomberg-ai": "new-york",
  "bbc-business": "london",
  "cnbc-markets": "new-york",
  "cnbc-top": "new-york",
  marketwatch: "new-york",
  "nyt-business": "new-york",
  "google-wsj": "new-york",
  "google-bloomberg": "new-york",
  "google-ft": "london",
  "google-reuters-biz": "london",
  "bbc-health": "london",
  "nyt-health": "new-york",
  "stat-news": "boston",
  "guardian-health": "london",
  "google-health-en": "new-york",
  "google-reuters-health": "london",
};

export type GlobeSignal = {
  hubId: string;
  hub: GeoHub;
  count: number;
  categories: NewsCategory[];
  latest: NewsItem;
  items: NewsItem[];
};

export function hubForSource(sourceId: string): GeoHub {
  const key = SOURCE_HUB[sourceId] || "new-york";
  return GEO_HUBS[key];
}

export function buildGlobeSignals(items: NewsItem[]): GlobeSignal[] {
  const buckets = new Map<string, NewsItem[]>();
  for (const item of items) {
    const hub = hubForSource(item.sourceId);
    const list = buckets.get(hub.id) ?? [];
    list.push(item);
    buckets.set(hub.id, list);
  }

  return [...buckets.entries()]
    .map(([hubId, hubItems]) => {
      const hub = GEO_HUBS[hubId];
      const sorted = [...hubItems].sort((a, b) => {
        const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
        const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
        return tb - ta;
      });
      return {
        hubId,
        hub,
        count: sorted.length,
        categories: [...new Set(sorted.map((item) => item.category))],
        latest: sorted[0],
        items: sorted.slice(0, 8),
      };
    })
    .sort((a, b) => b.count - a.count);
}
