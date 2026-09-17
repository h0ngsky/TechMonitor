export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[1180px] flex-col justify-center px-4">
      <p className="font-mono text-[11px] tracking-[0.28em] text-signal uppercase">Booting</p>
      <p className="mt-3 font-display text-5xl tracking-tight text-paper sm:text-7xl">MONITOR</p>
      <div className="mt-8 h-1 w-48 overflow-hidden bg-white/10">
        <div className="h-full w-1/2 animate-pulse bg-signal" />
      </div>
    </div>
  );
}
