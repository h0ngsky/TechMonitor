export type TranslateTarget = "zh" | "en";

const cache = new Map<string, string>();

function cacheKey(text: string, to: TranslateTarget) {
  return `${to}::${text}`;
}

function targetLang(to: TranslateTarget) {
  return to === "zh" ? "zh" : "en";
}

function shouldTranslate(text: string, to: TranslateTarget) {
  const sample = text.slice(0, 120);
  const hasCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(sample);
  const latin = sample.replace(/[^A-Za-z]/g, "").length;
  if (to === "zh") return !hasCjk && latin >= 8;
  return hasCjk;
}

async function translateViaGoogle(text: string, to: TranslateTarget, signal?: AbortSignal) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", to === "zh" ? "zh-CN" : "en");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url.toString(), {
    signal,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      accept: "application/json,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`google ${response.status}`);
  const data = (await response.json()) as unknown;
  const chunks = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
  const translated = chunks
    .map((part) => (Array.isArray(part) ? String(part[0] ?? "") : ""))
    .join("")
    .trim();
  if (!translated) throw new Error("google empty");
  return translated;
}

async function translateViaLingva(text: string, to: TranslateTarget, signal?: AbortSignal) {
  const hosts = ["https://lingva.ml", "https://lingva.garudalinux.org"];
  const source = to === "zh" ? "en" : "zh";
  const target = targetLang(to);
  let lastError: Error | null = null;
  for (const host of hosts) {
    try {
      const url = `${host}/api/v1/${source}/${target}/${encodeURIComponent(text)}`;
      const response = await fetch(url, {
        signal,
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error(`lingva ${response.status}`);
      const data = (await response.json()) as { translation?: string };
      const translated = data.translation?.trim();
      if (!translated) throw new Error("lingva empty");
      return translated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("lingva failed");
    }
  }
  throw lastError ?? new Error("lingva failed");
}

async function translateViaLibre(text: string, to: TranslateTarget, signal?: AbortSignal) {
  const response = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target: targetLang(to),
      format: "text",
    }),
  });
  if (!response.ok) throw new Error(`libre ${response.status}`);
  const data = (await response.json()) as { translatedText?: string };
  const translated = data.translatedText?.trim();
  if (!translated) throw new Error("libre empty");
  return translated;
}

async function translateOne(text: string, to: TranslateTarget, signal?: AbortSignal) {
  const key = cacheKey(text, to);
  const hit = cache.get(key);
  if (hit) return hit;

  const providers = [translateViaLingva, translateViaGoogle, translateViaLibre];
  let translated = text;
  for (const provider of providers) {
    try {
      translated = await provider(text, to, signal);
      if (translated && translated !== text) break;
    } catch {
      // try next provider
    }
  }

  cache.set(key, translated);
  return translated;
}

export async function translateTexts(
  texts: string[],
  to: TranslateTarget,
  signal?: AbortSignal,
) {
  const unique = [...new Set(texts.map((t) => t.trim()).filter(Boolean))];
  const out = new Map<string, string>();
  const pending = unique.filter((text) => {
    const key = cacheKey(text, to);
    const hit = cache.get(key);
    if (hit) {
      out.set(text, hit);
      return false;
    }
    return shouldTranslate(text, to);
  });

  const concurrency = 4;
  let index = 0;
  async function worker() {
    while (index < pending.length) {
      const current = pending[index];
      index += 1;
      try {
        const translated = await translateOne(current, to, signal);
        out.set(current, translated);
      } catch {
        out.set(current, current);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, Math.max(pending.length, 1)) }, () =>
      worker(),
    ),
  );

  return texts.map((text) => out.get(text.trim()) || text);
}
