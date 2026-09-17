const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }
  if (/^(0\.|10\.|127\.|169\.254\.|192\.168\.)/.test(host)) {
    return true;
  }
  const match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (match) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("u");
  if (!raw) {
    return new Response("Missing image url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new Response("Invalid image url", { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.has(target.protocol) || isPrivateHostname(target.hostname)) {
    return new Response("Blocked image url", { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; NewsMonitor/1.0; +https://vercel.com)",
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        referer: target.origin,
      },
      signal: AbortSignal.timeout(10000),
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new Response("Upstream image failed", { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/") && contentType !== "application/octet-stream") {
      return new Response("Not an image", { status: 415 });
    }

    const headers = new Headers();
    headers.set("content-type", contentType.startsWith("image/") ? contentType : "image/jpeg");
    headers.set("cache-control", "public, s-maxage=86400, stale-while-revalidate=604800");
    headers.set("x-content-type-options", "nosniff");

    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response("Image proxy error", { status: 502 });
  }
}
