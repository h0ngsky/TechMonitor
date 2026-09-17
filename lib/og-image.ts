const OG_RE =
  /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|og:image:url)["'][^>]+content=["']([^"']+)["'][^>]*>/i;
const OG_RE_ALT =
  /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image|og:image:url)["'][^>]*>/i;

function normalizeImageUrl(raw: string) {
  const url = raw.trim().replace(/&amp;/g, "&");
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (!/^https?:\/\//i.test(url)) return null;
  return url;
}

export async function fetchOgImage(
  articleUrl: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const response = await fetch(articleUrl, {
      signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; NewsMonitor/1.0; +https://vercel.com)",
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
      cache: "force-cache",
      next: { revalidate: 86400 },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return null;
    }
    const html = (await response.text()).slice(0, 180_000);
    const match = html.match(OG_RE) || html.match(OG_RE_ALT);
    if (!match?.[1]) return null;
    return normalizeImageUrl(match[1]);
  } catch {
    return null;
  }
}

export function faviconForUrl(articleUrl: string | null | undefined) {
  if (!articleUrl) return null;
  try {
    const host = new URL(articleUrl).hostname.replace(/^www\./, "");
    if (!host) return null;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  } catch {
    return null;
  }
}
