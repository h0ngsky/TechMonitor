import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_SC, Syne } from "next/font/google";
import { MONITOR_CRITICAL_CSS } from "@/lib/monitor-critical-css";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  fallback: ["PingFang SC", "Noto Sans SC", "Helvetica Neue", "Arial", "sans-serif"],
});

const body = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  fallback: ["PingFang SC", "Microsoft YaHei", "Helvetica Neue", "Arial", "sans-serif"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "MONITOR · 全球新闻巡检",
  description: "每天 09:00–20:00（北京时间）巡检科技、AI、金融、健康四大板块新闻。",
  appleWebApp: {
    capable: true,
    title: "MONITOR",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07110c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`dark ${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: MONITOR_CRITICAL_CSS }} />
      </head>
      <body className="min-h-full overflow-x-hidden bg-ink font-body text-paper">
        <div className="m-bg" aria-hidden />
        <div className="m-content">{children}</div>
      </body>
    </html>
  );
}
