import { MonitorDashboard } from "@/components/monitor-dashboard";
import { isInScanWindow } from "@/lib/clock";
import { getLatestSnapshot, type ScanSnapshot } from "@/lib/scan";

export const dynamic = "force-dynamic";

export default async function Home() {
  let snapshot: ScanSnapshot | null = null;
  let errorMessage: string | null = null;
  try {
    snapshot = await getLatestSnapshot();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "巡检失败";
  }

  return (
    <MonitorDashboard
      initialSnapshot={snapshot}
      initialInWindow={isInScanWindow()}
      initialError={errorMessage}
    />
  );
}
