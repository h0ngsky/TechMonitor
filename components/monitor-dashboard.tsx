"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import {
  formatInZone,
  isInScanWindow,
  nextScanAt,
} from "@/lib/clock";
import { BOARD_ORDER } from "@/lib/sources";
import { proxiedImageUrl } from "@/lib/image";
import type { NewsItem, ScanSnapshot } from "@/lib/scan";
import {
  CATEGORY_LABELS_I18N,
  MESSAGES,
  type Locale,
  intlLocale,
  readStoredLocale,
  relativeTime,
  storeLocale,
} from "@/lib/i18n";

type NewsResponse = {
  ok: boolean;
  inWindow?: boolean;
  snapshot?: ScanSnapshot;
  error?: string;
};

const PER_BOARD = 6;

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
  const [locale, setLocale] = useState<Locale>("zh");
  const [data, setData] = useState<ScanSnapshot | null>(initialSnapshot);
  const [inWindow, setInWindow] = useState(initialInWindow);
  const [nextLabel, setNextLabel] = useState("—");
  const [nowLabel, setNowLabel] = useState("—");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [query, setQuery] = useState("");
  const refreshingRef = useRef(false);

  const t = MESSAGES[locale];
  const categories = CATEGORY_LABELS_I18N[locale];

  useEffect(() => {
    const stored = readStoredLocale();
    // Hydrate from localStorage once after mount (SSR always starts as zh).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client preference restore
    if (stored) setLocale(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const setLocalePreference = useCallback((next: Locale) => {
    setLocale(next);
    storeLocale(next);
  }, []);

  const load = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    setError(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        cache: "no-store",
        signal: controller.signal,
      });
      const payload = (await response.json()) as NewsResponse;
      if (!response.ok || !payload.ok || !payload.snapshot) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setData(payload.snapshot);
      setInWindow(Boolean(payload.inWindow));
      setError(null);
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      setError(
        aborted
          ? locale === "zh"
            ? "巡检超时，请再试一次"
            : "Scan timed out, try again"
          : err instanceof Error
            ? err.message
            : MESSAGES[locale].scanErrorFallback,
      );
    } finally {
      window.clearTimeout(timer);
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }, [locale]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowLabel(
        formatInZone(
          now,
          {
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
          },
          intlLocale(locale),
        ),
      );
      setInWindow(isInScanWindow(now));
      setNextLabel(
        nextScanAt(now, {
          today: MESSAGES[locale].today,
          tomorrow: MESSAGES[locale].tomorrow,
        }),
      );
    };
    tick();
    const clock = window.setInterval(tick, 1000);
    const patrol = window.setInterval(() => {
      if (isInScanWindow()) void load();
    }, 15 * 60 * 1000);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(patrol);
    };
  }, [load, locale]);

  const items = useMemo(() => data?.items ?? [], [data]);
  const q = query.trim();

  const boards = useMemo(
    () =>
      BOARD_ORDER.map((key) => ({
        key,
        label: categories[key],
        items: items
          .filter((item) => item.category === key && matchesQuery(item, q))
          .slice(0, PER_BOARD),
        total: items.filter((item) => item.category === key).length,
      })),
    [items, q, categories],
  );

  const tickerItems = items.slice(0, 16);

  return (
    <div className="m-shell" data-locale={locale}>
      <header className="m-top">
        <div className="m-top-inner">
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 className="m-brand">MONITOR</h1>
            <span style={{ color: "var(--m-fog)", fontSize: "0.85rem" }}>
              {t.tagline}
            </span>
          </div>
          <div className="m-top-meta">
            <div className="m-lang" role="group" aria-label={t.langAria}>
              <button
                type="button"
                className={`m-lang-btn${locale === "zh" ? " is-active" : ""}`}
                onClick={() => setLocalePreference("zh")}
                aria-pressed={locale === "zh"}
              >
                中文
              </button>
              <button
                type="button"
                className={`m-lang-btn${locale === "en" ? " is-active" : ""}`}
                onClick={() => setLocalePreference("en")}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="m-dot" />
              {refreshing ? t.scanningBtn : inWindow ? t.scanning : t.standby}
            </span>
            <span suppressHydrationWarning>{nowLabel}</span>
            <span suppressHydrationWarning>
              {t.next} {nextLabel}
            </span>
            <button
              type="button"
              className="m-btn"
              onClick={() => void load()}
              disabled={refreshing}
              aria-busy={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? "m-spin" : undefined} />
              {refreshing ? t.scanningBtn : t.scanNow}
            </button>
          </div>
        </div>
      </header>

      {tickerItems.length > 0 ? (
        <div className="m-ticker">
          <div className="m-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item.id}-${index}`} className="m-ticker-item">
                <span className="m-ticker-cat">{categories[item.category]}</span>
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
              {t.lastScan}{" "}
              <strong>
                {data
                  ? formatInZone(
                      new Date(data.scannedAt),
                      {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23",
                      },
                      intlLocale(locale),
                    )
                  : "—"}
              </strong>
            </span>
            <span>
              {t.stories} <strong>{data?.itemCount ?? 0}</strong>
            </span>
            <span>
              {t.sources}{" "}
              <strong>
                {data?.okSourceCount ?? 0}/{data?.sourceCount ?? "—"}
              </strong>
            </span>
          </div>
          <label className="m-search-wrap">
            <span className="sr-only">{t.searchAria}</span>
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
              placeholder={t.search}
              aria-label={t.searchAria}
            />
          </label>
        </div>

        {error ? (
          <p className="m-empty">
            {t.scanFailed}：{error}{" "}
            <button type="button" className="m-btn" onClick={() => void load()}>
              {t.retry}
            </button>
          </p>
        ) : refreshing && !data ? (
          <p className="m-empty">{t.scanningEllipsis}</p>
        ) : (
          <div className="m-boards" key={locale}>
            {boards.map((board) => (
              <section key={board.key} className="m-board">
                <div className="m-board-head">
                  <h2 className="m-board-name">{board.label}</h2>
                  <span className="m-board-count">{board.total}</span>
                </div>
                {board.items.length === 0 ? (
                  <p className="m-empty">{t.emptyBoard}</p>
                ) : (
                  <ul className="m-list">
                    {board.items.map((item) => (
                      <NewsRow key={item.id} item={item} locale={locale} />
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

function NewsRow({ item, locale }: { item: NewsItem; locale: Locale }) {
  const imageSrc = proxiedImageUrl(item.imageUrl);
  const [showThumb, setShowThumb] = useState(Boolean(imageSrc));

  return (
    <li>
      <a
        className={`m-item${showThumb ? "" : " m-item--text"}`}
        href={item.link}
        target="_blank"
        rel="noreferrer"
      >
        {showThumb ? (
          <div className="m-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc!}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setShowThumb(false)}
            />
          </div>
        ) : null}
        <div className="m-item-body">
          <h3 className="m-item-title">{item.title}</h3>
          <p className="m-item-meta">
            {relativeTime(item.publishedAt, locale)} · {item.sourceName}
          </p>
        </div>
      </a>
    </li>
  );
}
