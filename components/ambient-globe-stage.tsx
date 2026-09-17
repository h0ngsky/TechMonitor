"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/lib/scan";
import { buildGlobeSignals, type GlobeSignal } from "@/lib/geo";
import { WorldGlobe } from "@/components/world-globe";
import type { Locale } from "@/lib/i18n";
import { CATEGORY_LABELS_I18N } from "@/lib/i18n";

function titleOf(item: NewsItem, locale: Locale) {
  return locale === "zh" ? item.titleZh || item.title : item.title;
}

export function AmbientGlobeStage({
  items,
  locale,
  onOpenStory,
}: {
  items: NewsItem[];
  locale: Locale;
  onOpenStory?: (item: NewsItem) => void;
}) {
  const signals = useMemo(() => buildGlobeSignals(items), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const active: GlobeSignal | null = signals[activeIndex % Math.max(signals.length, 1)] ?? null;

  useEffect(() => {
    if (paused || signals.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % signals.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [paused, signals.length]);

  const copy =
    locale === "zh"
      ? {
          kicker: "全球信号台",
          headline: "地球上每个角落，正在发生什么",
          support: "科技 · AI · 金融 · 健康 · 长时间值守桌面",
          live: "实时热点",
          stories: "条信号",
          open: "阅读原文",
        }
      : {
          kicker: "Signal Earth",
          headline: "See what is moving in every corner",
          support: "Tech · AI · Finance · Health · always-on desk display",
          live: "Live hubs",
          stories: "signals",
          open: "Open story",
        };

  return (
    <section
      className="m-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="m-stage-copy">
        <p className="m-stage-kicker">{copy.kicker}</p>
        <h2 className="m-stage-title">{copy.headline}</h2>
        <p className="m-stage-support">{copy.support}</p>

        {active ? (
          <article className="m-stage-card">
            <div className="m-stage-card-meta">
              <span>
                {locale === "zh" ? active.hub.cityZh : active.hub.city}
              </span>
              <span>·</span>
              <span>
                {locale === "zh" ? active.hub.regionZh : active.hub.region}
              </span>
              <span>·</span>
              <span>
                {active.count} {copy.stories}
              </span>
            </div>
            <h3 className="m-stage-card-title">
              {titleOf(active.latest, locale)}
            </h3>
            <p className="m-stage-card-source">
              {active.latest.sourceName}
              {" · "}
              {active.categories
                .map((category) => CATEGORY_LABELS_I18N[locale][category])
                .join(" / ")}
            </p>
            <div className="m-stage-card-actions">
              <a
                className="m-btn m-btn-ghost"
                href={active.latest.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => onOpenStory?.(active.latest)}
              >
                {copy.open}
              </a>
            </div>
          </article>
        ) : (
          <p className="m-stage-empty">
            {locale === "zh" ? "等待全球信号…" : "Waiting for global signals…"}
          </p>
        )}

        <div className="m-hub-list" aria-label={copy.live}>
          {signals.map((signal, index) => {
            const selected = signal.hubId === active?.hubId;
            return (
              <button
                key={signal.hubId}
                type="button"
                className={`m-hub-chip${selected ? " is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className="m-hub-dot" />
                <span>
                  {locale === "zh" ? signal.hub.cityZh : signal.hub.city}
                </span>
                <strong>{signal.count}</strong>
              </button>
            );
          })}
        </div>
      </div>

      <div className="m-stage-globe">
        <div className="m-globe-glow" aria-hidden />
        <WorldGlobe
          signals={signals}
          focusHubId={active?.hubId ?? null}
          className="m-globe-canvas"
        />
      </div>
    </section>
  );
}
