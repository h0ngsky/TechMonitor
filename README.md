# 全球新闻巡检看板

每天 **09:00–20:00（北京时间）** 对科技、硬件、AI、金融、美股等公开新闻源做一次巡检，结果展示在这个网页上。部署到 Vercel 后，Cron 会按半点自动拉取；本地打开看板时也可以立刻巡检。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:43123](http://localhost:43123)（或终端里提示的端口）。

## 部署到 Vercel

1. 把仓库接到 Vercel 项目并部署。
2. Cron 已写在 `vercel.json`：`0,30 1-12 * * *`（UTC），对应北京时间 09:00–20:30 的每个半点。真正落库扫描发生在 09:00–20:00 窗口内。
3. 建议在 Vercel 环境变量里设置 `CRON_SECRET`。设置后，Vercel 会自动带上 `Authorization: Bearer <secret>` 调用 `/api/cron/scan`。

Hobby 套餐对 Cron 频率有限制；若半点任务未能触发，打开网页或点「立即巡检」仍会拉最新稿件。Pro 套餐可按配置每 30 分钟跑一次。

## 数据从哪来

不依赖付费新闻 API。巡检读取公开 RSS（Google 新闻专题、BBC、TechCrunch、The Verge、Hacker News、CNBC 等）。个别源被墙或超时会在「源站健康」里标红，不影响其他源。

## 接口

- `GET /api/news`：读取最近一次巡检（25 分钟内复用缓存）
- `POST /api/news`：强制重新巡检
- `GET /api/cron/scan`：Vercel 定时任务入口
