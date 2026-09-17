import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6">
      <Skeleton className="h-10 w-64 bg-white/10" />
      <Skeleton className="h-5 w-96 bg-white/10" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 bg-white/10" />
        ))}
      </div>
    </div>
  );
}
