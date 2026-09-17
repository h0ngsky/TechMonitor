"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import {
  formatInZone,
  isInScanWindow,
  nextScanAt,
} from "@/lib/clock";
import { BOARD_ORDER, CATEGORY_LABELS } from "@/lib/sources";
import type { NewsItem, ScanSnapshot } from "@/lib/scan";

type NewsResponse = {
  ok: boolean;
  inWindow?: boolean;
  snapshot?: ScanSnapshot;
  error?: string;
};

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
  const q = query.trim();

  const boards = useMemo(
    () =>
      BOARD_ORDER.map((key) => ({
        key,
        label: CATEGORY_LABELS[key],
        items: items
          .filter((item) => item.category === key && matchesQuery(item, q))
          .slice(0, PER_BOARD),
        total: items.filter((item) => item.category === key).length,
      })),
    [items, q],
  );

  const tickerItems = items.slice(0, 16);

  return (
    <div className="m-shell">
      <header className="m-top">
        <div className="m-top-inner">
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 className="m-brand">MONITOR</h1>
            <span style={{ color: "var(--m-fog)", fontSize: "0.85rem" }}>
              科技 / AI / 金融 / 健康
            </span>
          </div>
          <div className="m-top-meta">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="m-dot" />
              {inWindow ? "巡检中" : "待命"}
            </span>
            <span>{nowLabel}</span>
            <span>下次 {nextLabel}</span>
            <button type="button" className="m-btn" onClick={() => void load()} disabled={refreshing}>
              <RefreshCw size={14} />
              {refreshing ? "扫描中" : "立即巡检"}
            </button>
          </div>
        </div>
      </header>

      {tickerItems.length > 0 ? (
        <div className="m-ticker">
          <div className="m-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item.id}-${index}`} className="m-ticker-item">
                <span className="m-ticker-cat">{CATEGORY_LABELS[item.category]}</span>
                <span className="m-ticker-title">{item.title}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <main className="m-main">
        <div className="m-toolbar">
          <div className="m-stats">
            <span>
              最近 <strong>{data ? formatInZone(new Date(data.scannedAt)) : "—"}</strong>
            </span>
            <span>
              稿件 <strong>{data?.itemCount ?? 0}</strong>
            </span>
            <span>
              源站{" "}
              <strong>
                {data?.okSourceCount ?? 0}/{data?.sourceCount ?? "—"}
              </strong>
            </span>
          </div>
          <label className="m-search-wrap">
            <span className="sr-only">搜索新闻</span>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--m-fog)",
                pointerEvents: "none",
              }}
            />
            <input
              className="m-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索…"
              aria-label="搜索新闻"
            />
          </label>
        </div>

        {error ? (
          <p className="m-empty">
            巡检失败：{error}{" "}
            <button type="button" className="m-btn" onClick={() => void load()}>
              重试
            </button>
          </p>
        ) : refreshing && !data ? (
          <p className="m-empty">正在巡检…</p>
        ) : (
          <div className="m-boards">
            {boards.map((board) => (
              <section key={board.key} className="m-board">
                <div className="m-board-head">
                  <h2 className="m-board-name">{board.label}</h2>
                  <span className="m-board-count">{board.total}</span>
                </div>
                {board.items.length === 0 ? (
                  <p className="m-empty">暂无稿件</p>
                ) : (
                  <ul className="m-list">
                    {board.items.map((item) => (
                      <NewsRow key={item.id} item={item} />
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <li>
      <a className="m-item" href={item.link} target="_blank" rel="noreferrer">
        <div className="m-thumb">
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
          <div className="m-thumb-fallback" hidden={Boolean(item.imageUrl)}>
            {CATEGORY_LABELS[item.category]}
          </div>
        </div>
        <div className="m-item-body">
          <h3 className="m-item-title">{item.title}</h3>
          <p className="m-item-meta">
            {relativeTime(item.publishedAt)} · {item.sourceName}
          </p>
        </div>
      </a>
    </li>
  );
}
