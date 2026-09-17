"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/lib/scan";
import { buildGlobeSignals, type GlobeSignal } from "@/lib/geo";
import { WorldGlobe } from "@/components/world-globe";
import type { Locale } from "@/lib/i18n";
import { CATEGORY_LABELS_I18N, relativeTime } from "@/lib/i18n";

function titleOf(item: NewsItem, locale: Locale) {
  return locale === "zh" ? item.titleZh || item.title : item.title;
}

export function AmbientGlobeStage({
  items,
  locale,
}: {
  items: NewsItem[];
  locale: Locale;
}) {
  const signals = useMemo(() => buildGlobeSignals(items), [items]);
  const [activeHubId, setActiveHubId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const resolvedHubId =
    activeHubId && signals.some((signal) => signal.hubId === activeHubId)
      ? activeHubId
      : signals[0]?.hubId ?? null;

  const active: GlobeSignal | null = useMemo(() => {
    if (!signals.length || !resolvedHubId) return null;
    return signals.find((signal) => signal.hubId === resolvedHubId) ?? signals[0];
  }, [signals, resolvedHubId]);

  useEffect(() => {
    if (paused || signals.length < 2) return;
    const id = window.setInterval(() => {
      setActiveHubId((current) => {
        const index = Math.max(
          0,
          signals.findIndex((signal) => signal.hubId === current),
        );
        return signals[(index + 1) % signals.length].hubId;
      });
      setPopKey((value) => value + 1);
    }, 8000);
    return () => window.clearInterval(id);
  }, [paused, signals]);

  const focusHub = (hubId: string) => {
    setActiveHubId(hubId);
    setPopKey((value) => value + 1);
    setPaused(true);
    window.setTimeout(() => setPaused(false), 10000);
  };

  const copy =
    locale === "zh"
      ? {
          kicker: "全球信号台",
          headline: "地球上每个角落，正在发生什么",
          support: "拖动地球转向城市 · 当地新闻会跳出来 · 适合长时间挂在桌面",
          live: "热点城市",
          stories: "条信号",
          open: "阅读原文",
          local: "当地快讯",
          hint: "按住拖动旋转",
        }
      : {
          kicker: "Signal Earth",
          headline: "See what is moving in every corner",
          support: "Drag the globe · local stories pop up · built for always-on desks",
          live: "Live hubs",
          stories: "signals",
          open: "Open story",
          local: "Local flash",
          hint: "Drag to rotate",
        };

  const localStories = active?.items.slice(0, 3) ?? [];

  return (
    <section className="m-stage">
      <div className="m-stage-copy">
        <p className="m-stage-kicker">{copy.kicker}</p>
        <h2 className="m-stage-title">{copy.headline}</h2>
        <p className="m-stage-support">{copy.support}</p>

        {active ? (
          <article className="m-stage-card" key={`card-${active.hubId}-${popKey}`}>
            <div className="m-stage-card-meta">
              <span>{locale === "zh" ? active.hub.cityZh : active.hub.city}</span>
              <span>·</span>
              <span>{locale === "zh" ? active.hub.regionZh : active.hub.region}</span>
              <span>·</span>
              <span>
                {active.count} {copy.stories}
              </span>
            </div>
            <h3 className="m-stage-card-title">{titleOf(active.latest, locale)}</h3>
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
          {signals.map((signal) => {
            const selected = signal.hubId === active?.hubId;
            return (
              <button
                key={signal.hubId}
                type="button"
                className={`m-hub-chip${selected ? " is-active" : ""}`}
                onClick={() => focusHub(signal.hubId)}
              >
                <span className="m-hub-dot" />
                <span>{locale === "zh" ? signal.hub.cityZh : signal.hub.city}</span>
                <strong>{signal.count}</strong>
              </button>
            );
          })}
        </div>
      </div>

      <div className="m-stage-globe">
        <div className="m-globe-glow" aria-hidden />
        <p className="m-globe-hint">{copy.hint}</p>
        <WorldGlobe
          signals={signals}
          focusHubId={active?.hubId ?? null}
          onFocusHub={focusHub}
          className="m-globe-canvas"
        />

        {active && localStories.length > 0 ? (
          <div className="m-globe-pop" key={`pop-${active.hubId}-${popKey}`}>
            <p className="m-globe-pop-label">
              {copy.local} · {locale === "zh" ? active.hub.cityZh : active.hub.city}
            </p>
            <ul className="m-globe-pop-list">
              {localStories.map((item, index) => (
                <li key={item.id} style={{ animationDelay: `${index * 80}ms` }}>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    <strong>{titleOf(item, locale)}</strong>
                    <span>
                      {relativeTime(item.publishedAt, locale)} · {item.sourceName}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
