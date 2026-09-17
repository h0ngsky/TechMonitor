import { getLatestSnapshot } from "@/lib/scan";
import { isInScanWindow } from "@/lib/clock";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const snapshot = await getLatestSnapshot();
    return Response.json({
      ok: true,
      inWindow: isInScanWindow(),
      snapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "巡检失败";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const snapshot = await getLatestSnapshot(true);
    return Response.json({
      ok: true,
      inWindow: isInScanWindow(),
      snapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "巡检失败";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
