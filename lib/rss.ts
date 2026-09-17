export type ParsedItem = {
  title: string;
  link: string;
  summary: string;
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
