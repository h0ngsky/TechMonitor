import { isInScanWindow } from "@/lib/clock";
import { runNewsScan } from "@/lib/scan";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const inWindow = isInScanWindow();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!inWindow && !force) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: "outside-window",
      inWindow,
    });
  }

  const snapshot = await runNewsScan();
  return Response.json({
    ok: true,
    skipped: false,
    inWindow,
    scannedAt: snapshot.scannedAt,
    itemCount: snapshot.itemCount,
    okSourceCount: snapshot.okSourceCount,
    failedSourceCount: snapshot.failedSourceCount,
  });
}
