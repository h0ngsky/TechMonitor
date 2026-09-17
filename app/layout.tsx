import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_SC, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root { color-scheme: dark; }
              html, body {
                margin: 0;
                min-height: 100%;
                background: #07110c;
                color: #edf5e8;
              }
              body { overflow-x: hidden; }
              a { color: inherit; text-decoration: none; }
              button, input { font: inherit; }
              img { max-width: 100%; height: auto; display: block; }
              .animate-ticker { display: flex; width: max-content; white-space: nowrap; }
            `,
          }}
        />
      </head>
      <body className="min-h-full overflow-x-hidden bg-ink font-body text-paper">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(200,245,66,0.14),_transparent_42%),radial-gradient(ellipse_at_bottom_right,_rgba(126,160,31,0.12),_transparent_40%),linear-gradient(180deg,#07110c_0%,#050d09_55%,#040a07_100%)]" />
          <div className="grid-atmosphere absolute inset-0" />
          <div className="noise-overlay absolute inset-0" />
        </div>
        <div className="relative flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
