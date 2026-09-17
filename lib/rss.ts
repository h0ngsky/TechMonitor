export type ParsedItem = {
  title: string;
  link: string;
  summary: string;
  imageUrl: string | null;
  publishedAt: string | null;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripHtml(value: string) {
  return decodeXml(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchTag(block: string, tag: string) {
  const cdata = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i"),
  );
  if (cdata) return stripHtml(cdata[1]);
  const normal = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return normal ? stripHtml(normal[1]) : "";
}

function matchRawTag(block: string, tag: string) {
  const cdata = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i"),
  );
  if (cdata) return cdata[1];
  const normal = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return normal ? normal[1] : "";
}

function matchLink(block: string) {
  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (href) return href[1].trim();
  return matchTag(block, "link") || matchTag(block, "guid");
}

function matchDate(block: string) {
  const raw =
    matchTag(block, "pubDate") ||
    matchTag(block, "published") ||
    matchTag(block, "updated") ||
    matchTag(block, "dc:date");
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function looksLikeImage(url: string) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/i.test(url) || /\/image\//i.test(url);
}

function normalizeImageUrl(raw: string) {
  const url = decodeXml(raw).trim();
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (!/^https?:\/\//i.test(url)) return null;
  return url;
}

function matchImage(block: string) {
  const mediaContent = [
    ...block.matchAll(/<media:content\b([^>]*)\/?>/gi),
  ];
  for (const match of mediaContent) {
    const attrs = match[1];
    const url = attrs.match(/\burl=["']([^"']+)["']/i)?.[1];
    const medium = attrs.match(/\bmedium=["']([^"']+)["']/i)?.[1] ?? "";
    const type = attrs.match(/\btype=["']([^"']+)["']/i)?.[1] ?? "";
    const normalized = url ? normalizeImageUrl(url) : null;
    if (
      normalized &&
      (medium === "image" || type.startsWith("image/") || looksLikeImage(normalized))
    ) {
      return normalized;
    }
  }

  const mediaThumb = block.match(/<media:thumbnail\b([^>]*)\/?>/i);
  if (mediaThumb) {
    const url = mediaThumb[1].match(/\burl=["']([^"']+)["']/i)?.[1];
    const normalized = url ? normalizeImageUrl(url) : null;
    if (normalized) return normalized;
  }

  for (const match of block.matchAll(/<enclosure\b([^>]*)\/?>/gi)) {
    const attrs = match[1];
    const url = attrs.match(/\burl=["']([^"']+)["']/i)?.[1];
    const type = attrs.match(/\btype=["']([^"']+)["']/i)?.[1] ?? "";
    const normalized = url ? normalizeImageUrl(url) : null;
    if (normalized && (type.startsWith("image/") || looksLikeImage(normalized))) {
      return normalized;
    }
  }

  const itunes = block.match(/<itunes:image\b([^>]*)\/?>/i);
  if (itunes) {
    const href = itunes[1].match(/\bhref=["']([^"']+)["']/i)?.[1];
    const normalized = href ? normalizeImageUrl(href) : null;
    if (normalized) return normalized;
  }

  const rawHtml =
    matchRawTag(block, "content:encoded") ||
    matchRawTag(block, "description") ||
    matchRawTag(block, "content") ||
    matchRawTag(block, "summary");
  const img = rawHtml.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (img) {
    const normalized = normalizeImageUrl(img[1]);
    if (normalized) return normalized;
  }

  return null;
}

function splitBlocks(xml: string, tag: string) {
  const blocks: string[] = [];
  const re = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) blocks.push(match[0]);
  return blocks;
}

export function parseFeed(xml: string): ParsedItem[] {
  const items = [...splitBlocks(xml, "item"), ...splitBlocks(xml, "entry")];
  return items
    .map((block) => {
      const title = matchTag(block, "title");
      const link = matchLink(block);
      const summary =
        matchTag(block, "description") ||
        matchTag(block, "summary") ||
        matchTag(block, "content") ||
        matchTag(block, "content:encoded");
      return {
        title,
        link,
        summary: summary.slice(0, 280),
        imageUrl: matchImage(block),
        publishedAt: matchDate(block),
      };
    })
    .filter((item) => item.title && item.link);
}

export async function fetchFeedXml(url: string, signal?: AbortSignal) {
  const response = await fetch(url, {
    signal,
    headers: {
      "user-agent":
        "NewsMonitor/1.0 (+https://vercel.com; global news patrol dashboard)",
      accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}
