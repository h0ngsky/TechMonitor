/** Critical monitor styles inlined into HTML for networks that block /_next/static CSS. */
export const MONITOR_CRITICAL_CSS = `
:root {
  color-scheme: dark;
  --m-ink: #07110c;
  --m-paper: #f7fbf3;
  --m-fog: #c5d8c4;
  --m-signal: #d4ff4f;
  --m-line: rgba(212, 255, 79, 0.2);
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
  position: relative;
  z-index: 40;
  border-bottom: 1px solid var(--m-line);
  padding: calc(0.75rem + env(safe-area-inset-top)) max(0.85rem, env(safe-area-inset-left)) 0.85rem max(0.85rem, env(safe-area-inset-right));
  background: rgba(7,17,12,0.92);
}
.m-top-inner {
  margin: 0 auto; width: 100%; max-width: 1480px;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1rem;
}
.m-brand-wrap {
  display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap;
}
.m-brand {
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-weight: 800; letter-spacing: -0.05em; line-height: 1;
  font-size: clamp(1.7rem, 4vw, 2.2rem); margin: 0; color: #ffffff;
}
.m-tagline { color: var(--m-fog); font-size: 0.85rem; }
.m-top-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px; color: var(--m-fog);
  position: relative; z-index: 41;
}
.m-status { display: inline-flex; align-items: center; gap: 6px; }
.m-dot {
  width: 8px; height: 8px; border-radius: 999px; background: var(--m-signal);
  display: inline-block;
}
.m-lang {
  display: inline-flex; align-items: stretch;
  border: 1px solid var(--m-line);
  border-radius: 0.45rem;
  background: rgba(12,23,17,0.95);
  position: relative;
  z-index: 50;
}
.m-lang-btn {
  appearance: none; border: 0; margin: 0; cursor: pointer;
  min-width: 3.5rem; min-height: 2.75rem; padding: 0 0.95rem;
  background: transparent; color: var(--m-fog);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 14px; font-weight: 700; letter-spacing: 0.04em;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(212,255,79,0.35);
  user-select: none;
  -webkit-user-select: none;
}
.m-lang-btn + .m-lang-btn { border-left: 1px solid var(--m-line); }
.m-lang-btn.is-active {
  background: var(--m-signal); color: var(--m-ink);
}
.m-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  min-height: 2.75rem; height: 2.75rem; padding: 0 1rem; border: 0; border-radius: 0;
  background: var(--m-signal); color: var(--m-ink); font-weight: 700; cursor: pointer; font-size: 0.95rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(212,255,79,0.35);
  user-select: none;
  -webkit-user-select: none;
}
.m-btn:disabled { opacity: 0.7; cursor: wait; }
@keyframes m-spin {
  to { transform: rotate(360deg); }
}
.m-spin { animation: m-spin 0.9s linear infinite; }

.m-ticker {
  overflow: hidden; border-bottom: 1px solid var(--m-line);
  background: var(--m-signal); color: var(--m-ink);
  pointer-events: none;
}
.m-ticker-track {
  display: flex; width: max-content; gap: 1.75rem; padding: 0.55rem 0; white-space: nowrap;
  animation: m-ticker 110s linear infinite;
}
.m-ticker-item { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0 0.35rem; }
.m-ticker-cat {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
}
.m-ticker-title { font-weight: 700; font-size: 0.95rem; }

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
  font-size: 13px; color: var(--m-fog);
}
.m-stats strong { color: #ffffff; font-weight: 650; }
.m-search-wrap { position: relative; width: min(100%, 16rem); }
.m-search {
  width: 100%; height: 2.5rem; padding: 0 0.65rem 0 2rem; border: 1px solid var(--m-line);
  background: rgba(12,23,17,0.85); color: #ffffff; outline: none; border-radius: 0.35rem; font-size: 1rem;
}

.m-boards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-items: start;
  min-height: 0;
}
.m-board {
  border: 1px solid var(--m-line);
  background: rgba(14, 26, 19, 0.92);
  border-radius: 0.75rem;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.m-board-head {
  display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem;
  padding: 0.85rem 0.9rem 0.7rem;
  border-bottom: 1px solid var(--m-line);
  background: rgba(7,17,12,0.55);
}
.m-board-name {
  margin: 0;
  font-family: "Syne", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 1.45rem; letter-spacing: -0.02em; color: #ffffff; font-weight: 750;
}
.m-board-count {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px; color: var(--m-signal); font-weight: 650;
}
.m-list {
  list-style: none; margin: 0; padding: 0.2rem 0;
  display: flex; flex-direction: column;
}
.m-item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  border-bottom: 1px solid rgba(212,255,79,0.1);
  align-items: start;
}
.m-item.m-item--text {
  grid-template-columns: 1fr;
}
.m-item:last-child { border-bottom: 0; }
.m-item:active, .m-item:hover { background: rgba(212,255,79,0.06); }
.m-thumb {
  width: 72px; height: 54px; border-radius: 0.4rem; overflow: hidden;
  background: #0a140f; border: 1px solid rgba(212,255,79,0.14); position: relative; flex-shrink: 0;
}
.m-thumb img { width: 100%; height: 100%; object-fit: cover; }
.m-thumb-fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; color: rgba(247,251,243,0.55); font-weight: 650;
  background: linear-gradient(135deg, #14261b, #07110c);
}
.m-item-body { min-width: 0; }
.m-item-title {
  margin: 0;
  font-size: 1.12rem;
  line-height: 1.45;
  font-weight: 700;
  color: #ffffff;
  white-space: normal;
  overflow: visible;
  display: block;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.m-item-meta {
  margin: 0.4rem 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px; color: var(--m-fog);
  white-space: normal;
  line-height: 1.4;
}
.m-empty {
  padding: 1.25rem 0.95rem; color: var(--m-fog); font-size: 1rem;
}

@keyframes m-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Phone / iPad portrait: 1 then 2 columns with wider title area */
@media (min-width: 760px) {
  .m-boards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.95rem; }
  .m-board { min-height: 30rem; }
  .m-list { max-height: 36rem; overflow: auto; -webkit-overflow-scrolling: touch; }
  .m-item { grid-template-columns: 80px 1fr; gap: 0.85rem; padding: 0.9rem; }
  .m-item.m-item--text { grid-template-columns: 1fr; }
  .m-thumb { width: 80px; height: 60px; }
  .m-item-title { font-size: 1.2rem; line-height: 1.48; }
  .m-board-name { font-size: 1.55rem; }
  .m-item-meta { font-size: 13px; }
}

/* iPad landscape (~1024–1366): stay on 2 columns so titles stay readable */
@media (min-width: 1024px) and (max-width: 1365px) {
  .m-boards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .m-board { min-height: calc(50vh - 3rem); }
  .m-list { max-height: none; }
  .m-item { grid-template-columns: 88px 1fr; }
  .m-item.m-item--text { grid-template-columns: 1fr; }
  .m-thumb { width: 88px; height: 66px; }
  .m-item-title { font-size: 1.22rem; line-height: 1.5; }
}

/* Wide desktop only: 4 columns */
@media (min-width: 1366px) {
  .m-boards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .m-board { min-height: calc(100vh - 10.5rem); }
  .m-list { max-height: none; flex: 1; overflow: auto; }
  .m-main { padding-top: 0.75rem; padding-bottom: 0.85rem; }
  .m-item { grid-template-columns: 72px 1fr; gap: 0.7rem; padding: 0.75rem 0.8rem; }
  .m-item.m-item--text { grid-template-columns: 1fr; }
  .m-thumb { width: 72px; height: 54px; }
  .m-item-title { font-size: 1.08rem; line-height: 1.45; }
}
@media (prefers-reduced-motion: reduce) {
  .m-ticker-track { animation: none; }
}
`.trim();
