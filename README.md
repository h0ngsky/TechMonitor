# 全球新闻巡检看板

每天 **09:00–20:00（北京时间）** 对科技、AI、金融、健康公开新闻源做巡检，结果展示在这个网页上。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:43123](http://localhost:43123)（或终端里提示的端口）。

## 部署到 Vercel

项目已按 Next.js 配置。Hobby 套餐的 Vercel Cron 每天只能跑一次，因此 `vercel.json` 里是北京时间 **09:00**（UTC `0 1 * * *`）的一次巡检。

半点巡检由 GitHub Actions 调用 `/api/cron/scan` 完成（北京时间 09:00–20:00，**每 15 分钟**一次）。打开网页或点「立即巡检」也会立刻拉取。升级 Vercel Pro 后，可以把平台 Cron 也调高。

每次巡检只是拉取公开 RSS，耗时很短，资源占用很低。

建议设置环境变量 `CRON_SECRET`；GitHub Actions 里同步配置同名 secret，请求会带 `Authorization: Bearer`。

## 数据从哪来

不依赖付费新闻 API。巡检读取公开 RSS（Google 新闻专题、BBC、TechCrunch、The Verge、Hacker News、CNBC 等）。个别源被墙或超时会在「源站健康」里标红，不影响其他源。

## 接口

- `GET /api/news`：读取最近一次巡检（约 12 分钟内复用缓存）
- `POST /api/news`：强制重新巡检
- `GET /api/cron/scan`：定时巡检入口
- `GET /api/img?u=`：图片代理（方便 iPad/国内访问外链封面）
