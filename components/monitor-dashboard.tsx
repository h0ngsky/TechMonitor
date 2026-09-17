"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatInZone,
  isInScanWindow,
  nextScanAt,
  windowCopy,
} from "@/lib/clock";
import { CATEGORY_LABELS, type NewsCategory } from "@/lib/sources";
import type { NewsItem, ScanSnapshot, SourceScanResult } from "@/lib/scan";

type NewsResponse = {
  ok: boolean;
  inWindow?: boolean;
  snapshot?: ScanSnapshot;
  error?: string;
};

const ALL = "all";

function relativeTime(iso: string | null) {
  if (!iso) return "时间未知";
  const delta = Date.now() - Date.parse(iso);
  const minutes = Math.max(0, Math.round(delta / 60000));
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.round(hours / 24)} 天前`;
}

export function MonitorDashboard({
  initialSnapshot,
  initialInWindow,
  initialError = null,
}: {
  initialSnapshot: ScanSnapshot | null;
  initialInWindow: boolean;
  initialError?: string | null;
}) {
  const [data, setData] = useState<ScanSnapshot | null>(initialSnapshot);
  const [inWindow, setInWindow] = useState(initialInWindow);
  const [nextLabel, setNextLabel] = useState("—");
  const [nowLabel, setNowLabel] = useState("—");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        cache: "no-store",
      });
      const payload = (await response.json()) as NewsResponse;
      if (!response.ok || !payload.ok || !payload.snapshot) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setData(payload.snapshot);
      setInWindow(Boolean(payload.inWindow));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法完成巡检");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowLabel(
        formatInZone(now, {
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
        }),
      );
      setInWindow(isInScanWindow(now));
      setNextLabel(nextScanAt(now));
    };
    tick();
    const clock = window.setInterval(tick, 1000);
    const patrol = window.setInterval(() => {
      if (isInScanWindow()) void load();
    }, 30 * 60 * 1000);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(patrol);
    };
  }, [load]);

  const items = useMemo(() => data?.items ?? [], [data]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== ALL && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  const tickerItems = items.slice(0, 18);

  return (
    <div className="relative flex w-full flex-col pb-[env(safe-area-inset-bottom)]">
      <Hero
        inWindow={inWindow}
        nowLabel={nowLabel}
        nextLabel={nextLabel}
        refreshing={refreshing}
        onScan={() => void load()}
        itemCount={data?.itemCount ?? 0}
        okSources={data?.okSourceCount ?? 0}
        sourceCount={data?.sourceCount ?? 0}
        scannedAt={data ? formatInZone(new Date(data.scannedAt)) : "—"}
      />

      {tickerItems.length > 0 ? <TickerRail items={tickerItems} /> : null}

      <main className="mx-auto w-full max-w-[1200px] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-16 pt-8 sm:px-6 md:pb-20 md:pt-10 lg:px-8">
        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:items-start lg:gap-12 xl:gap-14">
          <section className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-5 md:mb-8 md:gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.28em] text-signal uppercase">
                    Live Feed
                  </p>
                  <h2 className="mt-2 font-display text-3xl tracking-tight text-paper md:text-4xl">
                    巡检结果
                  </h2>
                </div>
                <label className="relative w-full md:max-w-sm">
                  <span className="sr-only">搜索新闻</span>
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fog" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索标题、摘要或来源"
                    className="h-12 rounded-none border-0 border-b border-line bg-transparent pl-10 text-base text-paper shadow-none focus-visible:ring-0 md:h-11 md:text-sm"
                  />
                </label>
              </div>

              <CategoryNav
                category={category}
                onChange={setCategory}
                total={items.length}
                counts={counts}
              />
            </div>

            {error ? (
              <EmptyState
                title="巡检失败"
                detail={error}
                action={
                  <Button
                    onClick={() => void load()}
                    className="h-12 rounded-none bg-signal px-5 text-ink hover:bg-signal/90"
                  >
                    重试
                  </Button>
                }
              />
            ) : refreshing && !data ? (
              <FeedSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState
                title={items.length === 0 ? "还没有稿件" : "没有匹配结果"}
                detail={
                  items.length === 0
                    ? "点击立即巡检，或等待下一个半点窗口。"
                    : "换个分类，或清空搜索词。"
                }
              />
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-2">
                {filtered.map((item, index) => (
                  <NewsCard key={item.id} item={item} index={index} />
                ))}
              </ul>
            )}
          </section>

          <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-72 xl:w-80">
            <p className="font-mono text-[11px] tracking-[0.28em] text-signal uppercase">
              Source Pulse
            </p>
            <h2 className="mt-2 font-display text-2xl text-paper md:text-[1.75rem]">源站健康</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-fog">{windowCopy()}</p>
            <div className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {!data ? (
                <FeedSkeleton compact />
              ) : (
                data.sources.map((source) => (
                  <SourcePulse key={source.sourceId} source={source} />
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Hero({
  inWindow,
  nowLabel,
  nextLabel,
  refreshing,
  onScan,
  itemCount,
  okSources,
  sourceCount,
  scannedAt,
}: {
  inWindow: boolean;
  nowLabel: string;
  nextLabel: string;
  refreshing: boolean;
  onScan: () => void;
  itemCount: number;
  okSources: number;
  sourceCount: number;
  scannedAt: string;
}) {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden border-b border-line pt-[env(safe-area-inset-top)] md:min-h-[72vh] lg:min-h-[88vh]">
      <RadarField />

      <div className="relative mx-auto flex min-h-[calc(78vh-env(safe-area-inset-top))] w-full max-w-[1200px] flex-col justify-between px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-7 sm:px-6 md:min-h-[72vh] md:py-9 lg:min-h-[88vh] lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-fog uppercase sm:gap-3 sm:text-[11px] sm:tracking-[0.24em]">
            <span className="inline-flex size-2 shrink-0 animate-pulse-dot rounded-full bg-signal" />
            <span className="truncate">{inWindow ? "Window Open" : "Standby"}</span>
            <span className="hidden text-line sm:inline">/</span>
            <span className="hidden sm:inline">Asia/Shanghai</span>
          </div>
          <p className="font-mono text-xs text-paper/80 tabular-nums md:text-sm">{nowLabel}</p>
        </div>

        <div className="max-w-4xl animate-rise py-8 md:py-12 lg:py-16">
          <p className="font-display text-[clamp(3.25rem,14vw,9.5rem)] leading-[0.84] font-extrabold tracking-[-0.06em] text-paper md:text-[clamp(4.5rem,12vw,10rem)] lg:text-[clamp(5rem,11vw,11rem)]">
            MONITOR
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-paper/75 md:mt-5 md:text-lg md:leading-8 lg:text-xl">
            全球新闻巡检。科技、硬件、AI、金融、美股公开源，半点自动扫一遍。
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              onClick={onScan}
              disabled={refreshing}
              className="h-12 min-w-[10.5rem] rounded-none bg-signal px-6 font-display text-base tracking-wide text-ink hover:bg-[#d7ff63] active:bg-[#e4ff8a] md:h-12"
            >
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "扫描中" : "立即巡检"}
            </Button>
            <p className="font-mono text-xs text-fog md:text-[13px]">
              下次计划 {nextLabel}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-line pt-5 md:grid-cols-4 md:gap-x-6 md:pt-6">
          <Metric label="最近巡检" value={scannedAt} />
          <Metric label="稿件" value={String(itemCount)} />
          <Metric label="源站" value={`${okSources}/${sourceCount || "—"}`} />
          <Metric label="节奏" value="30 MIN" />
        </dl>
      </div>
    </section>
  );
}

function RadarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[-8%] right-[-28%] h-[58vh] w-[58vh] opacity-70 sm:top-[-5%] sm:right-[-14%] sm:h-[70vh] sm:w-[70vh] sm:opacity-90 md:right-[-10%] md:h-[74vh] md:w-[74vh] lg:right-[-8%] lg:h-[78vh] lg:w-[78vh] lg:opacity-100"
    >
      <div className="absolute inset-[8%] rounded-full border border-signal/10" />
      <div className="absolute inset-[22%] rounded-full border border-signal/15" />
      <div className="absolute inset-[36%] rounded-full border border-signal/20" />
      <div className="absolute inset-[50%] rounded-full border border-signal/25" />
      <div className="absolute inset-0 animate-radar-sweep rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(200,245,66,0.18)_38deg,transparent_70deg)] opacity-80" />
      <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] tracking-[0.22em] text-fog uppercase">{label}</dt>
      <dd className="mt-2 font-mono text-base text-paper tabular-nums md:text-lg lg:text-xl">{value}</dd>
    </div>
  );
}

function TickerRail({ items }: { items: NewsItem[] }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-line bg-signal text-ink">
      <div className="animate-ticker flex w-max gap-8 py-3 whitespace-nowrap md:gap-10 md:py-3.5">
        {loop.map((item, index) => (
          <span key={`${item.id}-${index}`} className="inline-flex items-center gap-3 px-2">
            <span className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight md:text-[15px]">
              {item.title}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryNav({
  category,
  onChange,
  total,
  counts,
}: {
  category: string;
  onChange: (value: string) => void;
  total: number;
  counts: Map<string, number>;
}) {
  const options: Array<{ value: string; label: string; count: number }> = [
    { value: ALL, label: "全部", count: total },
    ...(Object.keys(CATEGORY_LABELS) as NewsCategory[]).map((key) => ({
      value: key,
      label: CATEGORY_LABELS[key],
      count: counts.get(key) ?? 0,
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label="新闻分类"
      className="flex gap-1 overflow-x-auto overscroll-x-contain border-b border-line pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const active = category === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative min-h-11 shrink-0 px-3.5 py-3 font-display text-[15px] tracking-wide transition-colors md:min-h-10 md:px-3 md:text-sm ${
              active ? "text-signal" : "text-fog active:text-paper hover:text-paper"
            }`}
          >
            {option.label}
            <span className="ml-2 font-mono text-[11px] opacity-70">{option.count}</span>
            {active ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 bg-signal" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <li
      className="animate-rise"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full min-h-[11.5rem] flex-col rounded-xl border border-line bg-[#0c1711]/80 p-5 transition-colors active:border-signal/50 active:bg-[#102016] hover:border-signal/45 hover:bg-[#102016] md:min-h-[13rem] md:p-6"
      >
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-signal uppercase">
          <span className="rounded-md bg-signal/12 px-2 py-1 text-signal">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="text-fog normal-case tracking-normal">
            {relativeTime(item.publishedAt)}
          </span>
        </div>
        <h3 className="mt-4 font-display text-[1.2rem] leading-snug tracking-tight text-paper transition-colors group-active:text-signal group-hover:text-signal md:text-[1.35rem]">
          {item.title}
        </h3>
        {item.summary ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-fog md:line-clamp-4">
            {item.summary}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/70 pt-4">
          <p className="truncate text-xs text-fog md:text-[13px]">{item.sourceName}</p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.16em] text-paper uppercase">
            Open
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </a>
    </li>
  );
}

function SourcePulse({ source }: { source: SourceScanResult }) {
  const strength = Math.min(12, source.itemCount) / 12;
  return (
    <div className="border-b border-line/70 py-3.5 md:py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-paper">{source.sourceName}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
            {CATEGORY_LABELS[source.category]}
          </p>
        </div>
        <p
          className={`font-mono text-xs ${source.ok ? "text-signal" : "text-destructive"}`}
          title={source.error}
        >
          {source.ok ? `${source.itemCount}` : "FAIL"}
        </p>
      </div>
      <div className="mt-3 h-1 bg-white/5">
        <div
          className={`h-full ${source.ok ? "bg-signal" : "bg-destructive"}`}
          style={{ width: source.ok ? `${Math.max(8, strength * 100)}%` : "100%" }}
        />
      </div>
    </div>
  );
}

function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 border border-dashed border-line px-6 py-16">
      <p className="font-display text-2xl text-paper">{title}</p>
      <p className="max-w-md text-sm leading-6 text-fog">{detail}</p>
      {action}
    </div>
  );
}

function FeedSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 border-b border-line/60 py-4">
            <div className="h-3 w-24 bg-white/8" />
            <div className="h-6 w-4/5 bg-white/8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-line p-5">
          <div className="h-3 w-20 bg-white/8" />
          <div className="h-6 w-full bg-white/8" />
          <div className="h-6 w-4/5 bg-white/8" />
          <div className="h-16 w-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}
