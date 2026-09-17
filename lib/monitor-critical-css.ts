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

.m-shell { position: relative; display: flex; flex-direction: column; width: 100%; min-height: 100vh; padding-bottom: env(safe-area-inset-bottom); }
.m-bg {
  pointer-events: none; position: fixed; inset: 0;
  background:
    radial-gradient(ellipse at top, rgba(200,245,66,0.12), transparent 42%),
    linear-gradient(180deg, #07110c 0%, #050d09 100%);
  z-index: 0;
}
.m-content { position: relative; z-index: 1; display: flex; min-height: 100%; flex-direction: column; }

.m-top {
  border-bottom: 1px solid var(--m-line);
  padding: calc(0.75rem + env(safe-area-inset-top)) max(0.85rem, env(safe-area-inset-left)) 0.85rem max(0.85rem, env(safe-area-inset-right));
}
.m-top-inner {
  margin: 0 auto; width: 100%; max-width: 1480px;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1rem;
}
.m-brand {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-weight: 800; letter-spacing: -0.05em; line-height: 1;
  font-size: clamp(1.6rem, 4vw, 2.1rem); margin: 0; color: var(--m-paper);
}
.m-top-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; color: var(--m-fog);
}
.m-dot {
  width: 7px; height: 7px; border-radius: 999px; background: var(--m-signal);
  display: inline-block;
}
.m-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  height: 2.25rem; padding: 0 0.9rem; border: 0; border-radius: 0;
  background: var(--m-signal); color: var(--m-ink); font-weight: 700; cursor: pointer; font-size: 0.85rem;
}
.m-btn:disabled { opacity: 0.7; cursor: wait; }

.m-ticker {
  overflow: hidden; border-bottom: 1px solid var(--m-line);
  background: var(--m-signal); color: var(--m-ink);
}
.m-ticker-track {
  display: flex; width: max-content; gap: 1.75rem; padding: 0.45rem 0; white-space: nowrap;
  animation: m-ticker 110s linear infinite;
}
.m-ticker-item { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 0.35rem; }
.m-ticker-cat {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
}
.m-ticker-title { font-weight: 650; font-size: 0.8rem; }

.m-main {
  margin: 0 auto; width: 100%; max-width: 1480px; flex: 1;
  padding: 0.85rem max(0.85rem, env(safe-area-inset-left)) 1.25rem max(0.85rem, env(safe-area-inset-right));
}
.m-toolbar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 0.65rem; margin-bottom: 0.75rem;
}
.m-stats {
  display: flex; flex-wrap: wrap; gap: 0.75rem 1.1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; color: var(--m-fog);
}
.m-stats strong { color: var(--m-paper); font-weight: 600; }
.m-search-wrap { position: relative; width: min(100%, 16rem); }
.m-search {
  width: 100%; height: 2.25rem; padding: 0 0.65rem 0 2rem; border: 1px solid var(--m-line);
  background: rgba(12,23,17,0.7); color: var(--m-paper); outline: none; border-radius: 0.35rem; font-size: 0.85rem;
}

.m-boards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  align-items: start;
  min-height: 0;
}
.m-board {
  border: 1px solid var(--m-line);
  background: rgba(12, 23, 17, 0.78);
  border-radius: 0.65rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.m-board-head {
  display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem;
  padding: 0.7rem 0.8rem 0.55rem;
  border-bottom: 1px solid var(--m-line);
  background: rgba(7,17,12,0.45);
}
.m-board-name {
  margin: 0;
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 1.2rem; letter-spacing: -0.02em; color: var(--m-paper);
}
.m-board-count {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px; color: var(--m-signal);
}
.m-list {
  list-style: none; margin: 0; padding: 0.25rem 0;
  display: flex; flex-direction: column;
}
.m-item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid rgba(200,245,66,0.08);
  align-items: start;
}
.m-item:last-child { border-bottom: 0; }
.m-item:active, .m-item:hover { background: rgba(200,245,66,0.04); }
.m-thumb {
  width: 72px; height: 54px; border-radius: 0.35rem; overflow: hidden;
  background: #0a140f; border: 1px solid rgba(200,245,66,0.1); position: relative; flex-shrink: 0;
}
.m-thumb img { width: 100%; height: 100%; object-fit: cover; }
.m-thumb-fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; color: rgba(237,245,232,0.35);
  background: linear-gradient(135deg, #102016, #07110c);
}
.m-item-body { min-width: 0; }
.m-item-title {
  margin: 0;
  font-size: 0.92rem; line-height: 1.35; color: var(--m-paper);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.m-item-meta {
  margin: 0.3rem 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; color: var(--m-fog);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.m-empty {
  padding: 1.25rem 0.85rem; color: var(--m-fog); font-size: 0.85rem;
}

@keyframes m-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (min-width: 760px) {
  .m-boards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }
  .m-board { min-height: 28rem; }
  .m-list { max-height: 26rem; overflow: auto; -webkit-overflow-scrolling: touch; }
}
@media (min-width: 1100px) {
  .m-boards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .m-board { min-height: calc(100vh - 10.5rem); }
  .m-list { max-height: none; flex: 1; overflow: auto; }
  .m-main { padding-top: 0.75rem; padding-bottom: 0.85rem; }
}
@media (prefers-reduced-motion: reduce) {
  .m-ticker-track { animation: none; }
}
`.trim();
