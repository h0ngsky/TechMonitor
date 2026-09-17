"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, RefreshCw, Search } from "lucide-react";
import {
  formatInZone,
  isInScanWindow,
  nextScanAt,
  windowCopy,
} from "@/lib/clock";
import {
  BOARD_ORDER,
  CATEGORY_LABELS,
} from "@/lib/sources";
import type { NewsItem, ScanSnapshot, SourceScanResult } from "@/lib/scan";

type NewsResponse = {
  ok: boolean;
  inWindow?: boolean;
  snapshot?: ScanSnapshot;
  error?: string;
};

const ALL = "all";
const PER_BOARD = 8;

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

function matchesQuery(item: NewsItem, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.summary.toLowerCase().includes(q) ||
    item.sourceName.toLowerCase().includes(q)
  );
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

  const boards = useMemo(() => {
    const q = query.trim();
    return BOARD_ORDER.map((key) => {
      const boardItems = items
        .filter((item) => item.category === key && matchesQuery(item, q))
        .slice(0, category === ALL ? PER_BOARD : 24);
      return {
        key,
        label: CATEGORY_LABELS[key],
        items: boardItems,
        total: items.filter((item) => item.category === key).length,
      };
    }).filter((board) => category === ALL || board.key === category);
  }, [items, query, category]);

  const visibleCount = boards.reduce((sum, board) => sum + board.items.length, 0);
  const tickerItems = items.slice(0, 16);
  const counts = Object.fromEntries(
    BOARD_ORDER.map((key) => [key, items.filter((item) => item.category === key).length]),
  );

  return (
    <div className="m-shell">
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

      <main className="m-main">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <p className="m-kicker" style={{ color: "var(--m-signal)" }}>
                Boards
              </p>
              <h2 className="m-section-title">四大板块</h2>
              <p style={{ margin: "0.5rem 0 0", color: "var(--m-fog)", fontSize: "0.95rem" }}>
                科技 · AI · 金融 · 健康
              </p>
            </div>
            <label style={{ position: "relative", width: "100%", maxWidth: "24rem" }}>
              <span className="sr-only">搜索新闻</span>
              <Search
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "var(--m-fog)",
                  pointerEvents: "none",
                }}
              />
              <input
                className="m-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、摘要或来源"
                aria-label="搜索新闻"
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
          <div style={{ marginTop: "2rem" }}>
            <EmptyState
              title="巡检失败"
              detail={error}
              action={
                <button type="button" className="m-btn" onClick={() => void load()}>
                  重试
                </button>
              }
            />
          </div>
        ) : refreshing && !data ? (
          <p style={{ marginTop: "2.5rem", color: "var(--m-fog)" }}>正在巡检…</p>
        ) : visibleCount === 0 ? (
          <div style={{ marginTop: "2rem" }}>
            <EmptyState
              title={items.length === 0 ? "还没有稿件" : "没有匹配结果"}
              detail={
                items.length === 0
                  ? "点击立即巡检，或等待下一个半点窗口。"
                  : "换个板块，或清空搜索词。"
              }
            />
          </div>
        ) : (
          <div>
            {boards.map((board) => (
              <BoardSection
                key={board.key}
                title={board.label}
                count={board.total}
                items={board.items}
                onFocus={() => setCategory(board.key)}
                focused={category === board.key}
              />
            ))}
          </div>
        )}

        <section className="m-sources">
          <p className="m-kicker" style={{ color: "var(--m-signal)" }}>
            Source Pulse
          </p>
          <h2 className="m-section-title" style={{ fontSize: "1.75rem" }}>
            源站健康
          </h2>
          <p style={{ margin: "0.5rem 0 0", color: "var(--m-fog)", fontSize: "0.9rem" }}>
            {windowCopy()}
          </p>
          <div className="m-source-grid">
            {!data
              ? null
              : data.sources.map((source) => (
                  <SourcePulse key={source.sourceId} source={source} />
                ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function BoardSection({
  title,
  count,
  items,
  onFocus,
  focused,
}: {
  title: string;
  count: number;
  items: NewsItem[];
  onFocus: () => void;
  focused: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="m-board">
      <div className="m-board-head">
        <div>
          <p className="m-kicker" style={{ color: "var(--m-signal)" }}>
            Board
          </p>
          <h3 className="m-board-name">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onFocus}
          style={{
            border: 0,
            background: "transparent",
            color: "var(--m-fog)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {focused ? `${items.length} 条` : `共 ${count} 条 →`}
        </button>
      </div>
      <ul className="m-grid">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
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
    <section className="m-hero">
      <div className="m-hero-inner">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <div className="m-kicker">
            <span className="m-dot" />
            <span>{inWindow ? "Window Open" : "Standby"}</span>
            <span>/</span>
            <span>Asia/Shanghai</span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "rgba(237,245,232,0.8)",
            }}
          >
            {nowLabel}
          </p>
        </div>

        <div style={{ padding: "2rem 0" }}>
          <p className="m-brand">MONITOR</p>
          <p className="m-lead">科技、AI、金融、健康四大板块巡检，半点自动扫一遍。</p>
          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <button type="button" className="m-btn" onClick={onScan} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "animate-spin" : undefined} />
              {refreshing ? "扫描中" : "立即巡检"}
            </button>
            <p
              style={{
                margin: 0,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                color: "var(--m-fog)",
              }}
            >
              下次计划 {nextLabel}
            </p>
          </div>
        </div>

        <dl className="m-metrics">
          <div>
            <dt>最近巡检</dt>
            <dd>{scannedAt}</dd>
          </div>
          <div>
            <dt>稿件</dt>
            <dd>{itemCount}</dd>
          </div>
          <div>
            <dt>源站</dt>
            <dd>
              {okSources}/{sourceCount || "—"}
            </dd>
          </div>
          <div>
            <dt>节奏</dt>
            <dd>30 MIN</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function TickerRail({ items }: { items: NewsItem[] }) {
  const loop = [...items, ...items];
  return (
    <div className="m-ticker">
      <div className="m-ticker-track">
        {loop.map((item, index) => (
          <span key={`${item.id}-${index}`} className="m-ticker-item">
            <span className="m-ticker-cat">{CATEGORY_LABELS[item.category]}</span>
            <span className="m-ticker-title">{item.title}</span>
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
  counts: Record<string, number>;
}) {
  const options: Array<{ value: string; label: string; count: number }> = [
    { value: ALL, label: "全部", count: total },
    ...BOARD_ORDER.map((key) => ({
      value: key,
      label: CATEGORY_LABELS[key],
      count: counts[key] ?? 0,
    })),
  ];

  return (
    <div className="m-tabs" role="tablist" aria-label="新闻板块">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={category === option.value}
          className="m-tab"
          onClick={() => onChange(option.value)}
        >
          {option.label}
          <span style={{ marginLeft: "0.5rem", opacity: 0.7, fontFamily: "ui-monospace, monospace", fontSize: 11 }}>
            {option.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <li>
      <a className="m-card" href={item.link} target="_blank" rel="noreferrer">
        <div className="m-card-media">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling;
                if (fallback instanceof HTMLElement) fallback.hidden = false;
              }}
            />
          ) : null}
          <div className="m-card-fallback" hidden={Boolean(item.imageUrl)}>
            <span>{CATEGORY_LABELS[item.category]}</span>
          </div>
          <span className="m-badge">{CATEGORY_LABELS[item.category]}</span>
        </div>
        <div className="m-card-body">
          <p className="m-card-time">{relativeTime(item.publishedAt)}</p>
          <h3 className="m-card-title">{item.title}</h3>
          {item.summary ? <p className="m-card-summary">{item.summary}</p> : null}
          <div className="m-card-foot">
            <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.sourceName}
            </p>
            <span className="m-open">
              Open <ArrowUpRight size={14} style={{ display: "inline", verticalAlign: "middle" }} />
            </span>
          </div>
        </div>
      </a>
    </li>
  );
}

function SourcePulse({ source }: { source: SourceScanResult }) {
  const strength = Math.min(12, source.itemCount) / 12;
  return (
    <div className="m-source">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ minWidth: 0 }}>
          <p className="m-source-name">{source.sourceName}</p>
          <p className="m-source-meta">{CATEGORY_LABELS[source.category]}</p>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            color: source.ok ? "var(--m-signal)" : "#ff6b4a",
          }}
          title={source.error}
        >
          {source.ok ? `${source.itemCount}` : "FAIL"}
        </p>
      </div>
      <div className="m-bar">
        <span style={{ width: source.ok ? `${Math.max(8, strength * 100)}%` : "100%", background: source.ok ? undefined : "#ff6b4a" }} />
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.75rem",
        border: "1px dashed var(--m-line)",
        padding: "3rem 1.5rem",
      }}
    >
      <p style={{ margin: 0, fontSize: "1.5rem", color: "var(--m-paper)" }}>{title}</p>
      <p style={{ margin: 0, maxWidth: "28rem", color: "var(--m-fog)", fontSize: "0.9rem", lineHeight: 1.6 }}>
        {detail}
      </p>
      {action}
    </div>
  );
}
