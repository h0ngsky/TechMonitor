import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "全球新闻巡检看板",
  description: "每天 09:00–20:00（北京时间）每 30 分钟巡检科技、硬件、AI、金融与美股新闻。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#070b12] font-sans text-slate-100">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_42%),linear-gradient(to_bottom,_#070b12,_#05070c_60%,_#04060a)]" />
        <div className="relative flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
