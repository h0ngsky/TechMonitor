"use client";

import { Button } from "@/components/ui/button";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-medium text-white">看板加载失败</h1>
      <p className="text-sm text-slate-500">{error.message}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
