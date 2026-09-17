/** Critical monitor styles inlined into HTML for networks that block /_next/static CSS. */
export const MONITOR_CRITICAL_CSS = `
:root {
  color-scheme: dark;
  --m-ink: #07110c;
  --m-paper: #ffffff;
  --m-fog: #d5e6d4;
  --m-signal: #d4ff4f;
  --m-line: rgba(212, 255, 79, 0.22);
  --m-card: #0e1a13;
}
html, body {
  margin: 0;
  min-height: 100%;
  background: var(--m-ink);
  color: var(--m-paper);
  font-family: "PingFang SC", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
    radial-gradient(ellipse at top, rgba(212,255,79,0.12), transparent 42%),
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
  font-size: clamp(1.7rem, 4vw, 2.2rem); margin: 0; color: #ffffff;
}
.m-top-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px; color: var(--m-fog);
}
.m-dot {
  width: 8px; height: 8px; border-radius: 999px; background: var(--m-signal);
  display: inline-block;
}
.m-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  height: 2.6rem; padding: 0 1rem; border: 0; border-radius: 0;
  background: var(--m-signal); color: var(--m-ink); font-weight: 700; cursor: pointer; font-size: 1rem;
}
.m-btn:disabled { opacity: 0.7; cursor: wait; }

.m-ticker {
  overflow: hidden; border-bottom: 1px solid var(--m-line);
  background: var(--m-signal); color: var(--m-ink);
}
.m-ticker-track {
  display: flex; width: max-content; gap: 1.75rem; padding: 0.6rem 0; white-space: nowrap;
  animation: m-ticker 110s linear infinite;
}
.m-ticker-item { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 0.35rem; }
.m-ticker-cat {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
}
.m-ticker-title { font-weight: 700; font-size: 1.05rem; }

.m-main {
  margin: 0 auto; width: 100%; max-width: 1480px; flex: 1;
  padding: 0.85rem max(0.85rem, env(safe-area-inset-left)) 1.25rem max(0.85rem, env(safe-area-inset-right));
}
.m-toolbar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 0.65rem; margin-bottom: 0.85rem;
}
.m-stats {
  display: flex; flex-wrap: wrap; gap: 0.75rem 1.1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px; color: var(--m-fog);
}
.m-stats strong { color: #ffffff; font-weight: 700; }
.m-search-wrap { position: relative; width: min(100%, 16rem); }
.m-search {
  width: 100%; height: 2.6rem; padding: 0 0.65rem 0 2rem; border: 1px solid var(--m-line);
  background: rgba(12,23,17,0.85); color: #ffffff; outline: none; border-radius: 0.35rem; font-size: 1.05rem;
}

.m-boards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-items: start;
  min-height: 0;
}
.m-board {
  border: 1px solid var(--m-line);
  background: rgba(14, 26, 19, 0.96);
  border-radius: 0.75rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.m-board-head {
  display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem;
  padding: 0.9rem 1rem 0.75rem;
  border-bottom: 1px solid var(--m-line);
  background: rgba(7,17,12,0.55);
}
.m-board-name {
  margin: 0;
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 1.55rem; letter-spacing: -0.02em; color: #ffffff; font-weight: 800;
}
.m-board-count {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px; color: var(--m-signal); font-weight: 700;
}
.m-list {
  list-style: none; margin: 0; padding: 0.15rem 0;
  display: flex; flex-direction: column;
}
.m-item {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  padding: 0.95rem 1rem;
  border-bottom: 1px solid rgba(212,255,79,0.12);
  align-items: start;
}
.m-item:last-child { border-bottom: 0; }
.m-item:active, .m-item:hover { background: rgba(212,255,79,0.07); }
.m-thumb {
  width: 100%; height: 9.5rem; border-radius: 0.45rem; overflow: hidden;
  background: #0a140f; border: 1px solid rgba(212,255,79,0.16); position: relative; flex-shrink: 0;
}
.m-thumb img { width: 100%; height: 100%; object-fit: cover; }
.m-thumb-fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: rgba(255,255,255,0.7); font-weight: 700;
  background: linear-gradient(135deg, #14261b, #07110c);
}
.m-item-body { min-width: 0; width: 100%; }
.m-item-title {
  margin: 0;
  font-size: 1.22rem;
  line-height: 1.5;
  font-weight: 700;
  color: #ffffff;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  display: block;
  max-height: none;
  -webkit-line-clamp: unset;
  line-clamp: unset;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.m-item-meta {
  margin: 0.5rem 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px; color: var(--m-fog);
  white-space: normal;
  line-height: 1.45;
}
.m-empty {
  padding: 1.25rem 0.95rem; color: var(--m-fog); font-size: 1.05rem;
}

@keyframes m-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* iPad portrait / small tablet: 2 columns, large full titles */
@media (min-width: 760px) {
  .m-boards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .m-board { min-height: 28rem; }
  .m-list { max-height: 38rem; overflow: auto; -webkit-overflow-scrolling: touch; }
  .m-item {
    grid-template-columns: 112px 1fr;
    gap: 0.95rem;
    padding: 1rem;
    align-items: start;
  }
  .m-thumb { width: 112px; height: 84px; }
  .m-item-title { font-size: 1.28rem; line-height: 1.5; font-weight: 700; }
  .m-board-name { font-size: 1.7rem; }
  .m-item-meta { font-size: 14px; }
}

/* iPad landscape: stay 2 columns so titles remain large and fully readable */
@media (min-width: 1024px) and (max-width: 1399px) {
  .m-boards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem; }
  .m-item { grid-template-columns: 128px 1fr; gap: 1rem; padding: 1.05rem 1.1rem; }
  .m-thumb { width: 128px; height: 96px; }
  .m-item-title { font-size: 1.32rem; line-height: 1.52; }
  .m-board-name { font-size: 1.8rem; }
  .m-list { max-height: none; }
  .m-board { min-height: calc(50vh - 4rem); }
}

/* Wide desktop only: 4 columns */
@media (min-width: 1400px) {
  .m-boards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .m-board { min-height: calc(100vh - 10.5rem); }
  .m-list { max-height: none; flex: 1; overflow: auto; }
  .m-main { padding-top: 0.75rem; padding-bottom: 0.85rem; }
  .m-item { grid-template-columns: 1fr; gap: 0.65rem; padding: 0.9rem; }
  .m-thumb { width: 100%; height: 7.5rem; }
  .m-item-title { font-size: 1.18rem; line-height: 1.48; }
}
@media (prefers-reduced-motion: reduce) {
  .m-ticker-track { animation: none; }
}
`.trim();
