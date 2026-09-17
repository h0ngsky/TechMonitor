"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Clock3,
  Newspaper,
  Radio,
  RefreshCw,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const days = Math.round(hours / 24);
  return `${days} 天前`;
}

function categoryTone(category: NewsCategory) {
  switch (category) {
    case "ai":
      return "bg-violet-500/15 text-violet-300 ring-violet-500/30";
    case "tech":
      return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
    case "hardware":
      return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
    case "finance":
      return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    case "us-markets":
      return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-slate-500/30";
  }
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
  const [nextLabel, setNextLabel] = useState(nextScanAt());
  const [nowLabel, setNowLabel] = useState(
    formatInZone(new Date(), {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }),
  );
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
    const clock = window.setInterval(() => {
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
    }, 1000);
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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-cyan-300/80 uppercase">
            <Radio className="size-3.5 animate-pulse" />
            GLOBAL NEWS MONITOR
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            全球新闻巡检看板
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            覆盖科技、硬件、AI、金融与美股公开源。Vercel Cron 按北京时间 {windowCopy()}；看板打开时也会同步刷新。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-white/10 bg-white/5 font-mono text-slate-200">
            <Clock3 />
            {nowLabel}
          </Badge>
          <Badge
            className={
              inWindow
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-500/20 text-slate-300"
            }
          >
            {inWindow ? "巡检窗口开启" : "窗口外待命"}
          </Badge>
          <Button onClick={() => void load()} disabled={refreshing}>
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "巡检中" : "立即巡检"}
          </Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="最近巡检"
          value={data ? formatInZone(new Date(data.scannedAt)) : "—"}
          hint={`下次计划：${nextLabel}`}
          icon={<Activity className="size-4 text-cyan-300" />}
        />
        <StatCard
          label="条目"
          value={data ? String(data.itemCount) : "—"}
          hint={query || category !== ALL ? `当前筛选 ${filtered.length} 条` : "去重后的最新稿件"}
          icon={<Newspaper className="size-4 text-sky-300" />}
        />
        <StatCard
          label="源站在线"
          value={data ? `${data.okSourceCount}/${data.sourceCount}` : "—"}
          hint={data ? `${data.failedSourceCount} 个源失败` : "等待首次巡检"}
          icon={<Radio className="size-4 text-emerald-300" />}
        />
        <StatCard
          label="节奏"
          value="30 min"
          hint="09:00–20:00 · Asia/Shanghai"
          icon={<Clock3 className="size-4 text-amber-300" />}
        />
      </section>

      <Card className="border-white/10 bg-slate-950/60 ring-white/10">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>巡检结果</CardTitle>
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、摘要或来源"
                aria-label="搜索新闻"
                className="border-white/10 bg-black/30 pl-8"
              />
            </div>
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1">
              <TabsTrigger value={ALL} className="flex-none">
                全部 {items.length}
              </TabsTrigger>
              {(Object.keys(CATEGORY_LABELS) as NewsCategory[]).map((key) => (
                <TabsTrigger key={key} value={key} className="flex-none">
                  {CATEGORY_LABELS[key]} {counts.get(key) ?? 0}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <EmptyState
              title="巡检失败"
              detail={error}
              action={
                <Button variant="outline" onClick={() => void load()}>
                  重试
                </Button>
              }
            />
          ) : refreshing && !data ? (
            <NewsSkeleton />
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
            <ul className="grid gap-3">
              {filtered.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-950/60 ring-white/10">
        <CardHeader>
          <CardTitle>源站健康</CardTitle>
        </CardHeader>
        <CardContent>
          {!data ? (
            <NewsSkeleton compact />
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {data.sources.map((source) => (
                <SourceRow key={source.sourceId} source={source} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-slate-950/70 ring-white/10">
      <CardContent className="flex items-start justify-between gap-3 pt-1">
        <div>
          <p className="text-xs tracking-wide text-slate-500 uppercase">{label}</p>
          <p className="mt-1 font-mono text-xl text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-2">{icon}</div>
      </CardContent>
    </Card>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <li>
      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="block rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge className={`ring-1 ${categoryTone(item.category)}`}>
            {CATEGORY_LABELS[item.category]}
          </Badge>
          <span className="text-slate-500">{item.sourceName}</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-slate-500">{relativeTime(item.publishedAt)}</span>
        </div>
        <h2 className="mt-2 text-base font-medium text-slate-50">{item.title}</h2>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{item.summary}</p>
        ) : null}
      </a>
    </li>
  );
}

function SourceRow({ source }: { source: SourceScanResult }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-black/20 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-200">{source.sourceName}</p>
        <p className="text-xs text-slate-500">{CATEGORY_LABELS[source.category]}</p>
      </div>
      {source.ok ? (
        <Badge className="bg-emerald-500/15 text-emerald-300">{source.itemCount} 条</Badge>
      ) : (
        <Badge className="bg-rose-500/15 text-rose-300" title={source.error}>
          <AlertTriangle className="size-3" />
          失败
        </Badge>
      )}
    </li>
  );
}

function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
      <p className="text-base font-medium text-white">{title}</p>
      <p className="max-w-md text-sm text-slate-500">{detail}</p>
      {action}
    </div>
  );
}

function NewsSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: compact ? 3 : 6 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-xl border border-white/8 p-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-5 w-5/6 bg-white/10" />
          {!compact ? <Skeleton className="h-4 w-full bg-white/10" /> : null}
        </div>
      ))}
    </div>
  );
}
