/** Critical monitor styles inlined into HTML for networks that block /_next/static CSS. */
export const MONITOR_CRITICAL_CSS = `
:root {
  color-scheme: dark;
  --m-ink: #07110c;
  --m-paper: #edf5e8;
  --m-fog: #93a897;
  --m-signal: #c8f542;
  --m-line: rgba(200, 245, 66, 0.16);
  --m-card: #0c1711;
}
html, body {
  margin: 0;
  min-height: 100%;
  background: var(--m-ink);
  color: var(--m-paper);
  font-family: "PingFang SC", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
button, input { font: inherit; color: inherit; }
img { max-width: 100%; height: auto; display: block; }
* { box-sizing: border-box; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

.m-shell { position: relative; display: flex; flex-direction: column; width: 100%; padding-bottom: env(safe-area-inset-bottom); }
.m-bg {
  pointer-events: none; position: fixed; inset: 0;
  background:
    radial-gradient(ellipse at top, rgba(200,245,66,0.14), transparent 42%),
    radial-gradient(ellipse at bottom right, rgba(126,160,31,0.12), transparent 40%),
    linear-gradient(180deg, #07110c 0%, #050d09 55%, #040a07 100%);
  z-index: 0;
}
.m-content { position: relative; z-index: 1; display: flex; min-height: 100%; flex-direction: column; }

.m-hero {
  position: relative; isolation: isolate; overflow: hidden;
  min-height: 72vh; border-bottom: 1px solid var(--m-line);
  padding-top: env(safe-area-inset-top);
}
.m-hero-inner {
  position: relative; margin: 0 auto; width: 100%; max-width: 1280px;
  min-height: calc(72vh - env(safe-area-inset-top));
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 1.75rem max(1rem, env(safe-area-inset-left)) 1.75rem max(1rem, env(safe-area-inset-right));
}
.m-kicker {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--m-fog);
}
.m-dot {
  width: 8px; height: 8px; border-radius: 999px; background: var(--m-signal);
  display: inline-block; flex-shrink: 0;
}
.m-brand {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-weight: 800; letter-spacing: -0.06em; line-height: 0.84;
  font-size: clamp(3.25rem, 14vw, 9.5rem); margin: 0; color: var(--m-paper);
}
.m-lead {
  margin: 1.25rem 0 0; max-width: 40rem; font-size: 1.05rem; line-height: 1.7; color: rgba(237,245,232,0.75);
}
.m-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  height: 3rem; min-width: 10.5rem; padding: 0 1.5rem; border: 0; border-radius: 0;
  background: var(--m-signal); color: var(--m-ink); font-weight: 700; cursor: pointer;
}
.m-btn:disabled { opacity: 0.7; cursor: wait; }
.m-metrics {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem 1.25rem;
  border-top: 1px solid var(--m-line); padding-top: 1.25rem; margin: 0;
}
.m-metrics dt {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--m-fog);
}
.m-metrics dd {
  margin: 0.5rem 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.05rem; color: var(--m-paper);
}

.m-ticker {
  overflow: hidden; border-bottom: 1px solid var(--m-line);
  background: var(--m-signal); color: var(--m-ink);
}
.m-ticker-track {
  display: flex; width: max-content; gap: 2.5rem; padding: 0.75rem 0; white-space: nowrap;
  animation: m-ticker 110s linear infinite;
}
.m-ticker-item { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0 0.5rem; }
.m-ticker-cat {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
}
.m-ticker-title { font-weight: 700; font-size: 0.95rem; }

.m-main {
  margin: 0 auto; width: 100%; max-width: 1280px;
  padding: 2rem max(1rem, env(safe-area-inset-left)) 5rem max(1rem, env(safe-area-inset-right));
}
.m-section-title {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(1.75rem, 4vw, 3rem); letter-spacing: -0.02em; margin: 0.4rem 0 0; color: var(--m-paper);
}
.m-tabs {
  display: flex; gap: 0.25rem; overflow-x: auto; border-bottom: 1px solid var(--m-line);
  margin-top: 1.5rem; -webkit-overflow-scrolling: touch;
}
.m-tab {
  position: relative; flex-shrink: 0; min-height: 3rem; padding: 0.85rem 1rem;
  border: 0; background: transparent; color: var(--m-fog); cursor: pointer;
  font-size: 1rem; font-weight: 600;
}
.m-tab[aria-selected="true"] { color: var(--m-signal); }
.m-tab[aria-selected="true"]::after {
  content: ""; position: absolute; left: 0.75rem; right: 0.75rem; bottom: -1px;
  height: 2px; background: var(--m-signal);
}
.m-search {
  width: 100%; height: 3rem; padding: 0 0.75rem 0 2.5rem; border: 0; border-bottom: 1px solid var(--m-line);
  background: transparent; color: var(--m-paper); outline: none;
}

.m-board { margin-top: 3.5rem; }
.m-board + .m-board { margin-top: 4.5rem; }
.m-board-head {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
  border-bottom: 1px solid var(--m-line); padding-bottom: 1rem; margin-bottom: 1.5rem;
}
.m-board-name {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(2rem, 5vw, 3rem); margin: 0.25rem 0 0; color: var(--m-paper);
}
.m-grid {
  display: grid; grid-template-columns: 1fr; gap: 1.5rem; list-style: none; margin: 0; padding: 0;
}
.m-card {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  border: 1px solid var(--m-line); border-radius: 1rem; background: rgba(12, 23, 17, 0.9);
}
.m-card-media {
  position: relative; aspect-ratio: 16 / 10; overflow: hidden;
  border-bottom: 1px solid rgba(200,245,66,0.12); background: #0a140f;
}
.m-card-media img {
  width: 100%; height: 100%; object-fit: cover;
}
.m-card-fallback {
  position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 1.25rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(200,245,66,0.18), transparent 42%),
    linear-gradient(135deg, #102016, #07110c 60%);
}
.m-card-fallback span {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 2.5rem; color: rgba(237,245,232,0.25);
}
.m-badge {
  position: absolute; top: 1rem; left: 1rem; z-index: 1;
  padding: 0.35rem 0.65rem; border-radius: 0.4rem;
  background: rgba(7,17,12,0.75); color: var(--m-signal);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
}
.m-card-body { display: flex; flex: 1; flex-direction: column; padding: 1.35rem 1.5rem 1.5rem; }
.m-card-time {
  margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; color: var(--m-fog);
}
.m-card-title {
  margin: 0.75rem 0 0;
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem); line-height: 1.25; color: var(--m-paper);
}
.m-card-summary {
  margin: 0.75rem 0 0; flex: 1; color: var(--m-fog); font-size: 0.95rem; line-height: 1.7;
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
}
.m-card-foot {
  margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(200,245,66,0.12);
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  color: var(--m-fog); font-size: 0.875rem;
}
.m-open {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--m-paper);
}

.m-sources {
  margin-top: 4rem; padding-top: 2.5rem; border-top: 1px solid var(--m-line);
}
.m-source-grid {
  display: grid; grid-template-columns: 1fr; gap: 0.25rem 2rem; margin-top: 1.25rem;
}
.m-source {
  border-bottom: 1px solid rgba(200,245,66,0.12); padding: 0.85rem 0;
}
.m-source-name { margin: 0; color: var(--m-paper); font-size: 0.9rem; }
.m-source-meta {
  margin: 0.35rem 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--m-fog);
}
.m-bar { margin-top: 0.75rem; height: 4px; background: rgba(255,255,255,0.05); }
.m-bar > span { display: block; height: 100%; background: var(--m-signal); }

@keyframes m-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (min-width: 768px) {
  .m-metrics { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .m-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.75rem; }
  .m-card-media { aspect-ratio: 16 / 9; }
  .m-source-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .m-hero-inner { padding-left: 1.5rem; padding-right: 1.5rem; }
}
@media (min-width: 1024px) {
  .m-source-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .m-main, .m-hero-inner { padding-left: 2rem; padding-right: 2rem; }
}
@media (prefers-reduced-motion: reduce) {
  .m-ticker-track { animation: none; }
}
`.trim();
