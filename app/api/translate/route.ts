import { translateTexts, type TranslateTarget } from "@/lib/translate";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Body = {
  texts?: unknown;
  to?: unknown;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const to = body.to;
  if (to !== "zh" && to !== "en") {
    return Response.json({ ok: false, error: "Invalid target" }, { status: 400 });
  }

  const texts = Array.isArray(body.texts)
    ? body.texts.filter((t): t is string => typeof t === "string").slice(0, 48)
    : [];

  if (texts.length === 0) {
    return Response.json({ ok: true, translations: [] });
  }

  try {
    const translations = await translateTexts(texts, to as TranslateTarget, request.signal);
    return Response.json({ ok: true, translations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "translate failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
