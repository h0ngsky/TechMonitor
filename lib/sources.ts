export type NewsCategory = "tech" | "ai" | "finance" | "health";

export type NewsSource = {
  id: string;
  name: string;
  category: NewsCategory;
  feedUrl: string;
};

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  tech: "科技",
  ai: "AI",
  finance: "金融",
  health: "健康",
};

export const BOARD_ORDER: NewsCategory[] = ["tech", "ai", "finance", "health"];

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "techcrunch",
    name: "TechCrunch",
    category: "tech",
    feedUrl: "https://techcrunch.com/feed/",
  },
  {
    id: "the-verge",
    name: "The Verge",
    category: "tech",
    feedUrl: "https://www.theverge.com/rss/index.xml",
  },
  {
    id: "wired",
    name: "WIRED",
    category: "tech",
    feedUrl: "https://www.wired.com/feed/rss",
  },
  {
    id: "engadget",
    name: "Engadget",
    category: "tech",
    feedUrl: "https://www.engadget.com/rss.xml",
  },
  {
    id: "bbc-tech",
    name: "BBC Technology",
    category: "tech",
    feedUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  },
  {
    id: "mit-tr",
    name: "MIT Technology Review",
    category: "ai",
    feedUrl: "https://www.technologyreview.com/feed/",
  },
  {
    id: "google-ai",
    name: "Google 新闻 · AI",
    category: "ai",
    feedUrl:
      "https://news.google.com/rss/search?q=artificial+intelligence+OR+OpenAI+OR+Anthropic+OR+LLM&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-ai-zh",
    name: "Google 新闻 · 人工智能",
    category: "ai",
    feedUrl:
      "https://news.google.com/rss/search?q=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD+OR+AI+OR+%E5%A4%A7%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
  {
    id: "ars-ai",
    name: "Ars Technica",
    category: "ai",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/index",
  },
  {
    id: "bbc-business",
    name: "BBC Business",
    category: "finance",
    feedUrl: "https://feeds.bbci.co.uk/news/business/rss.xml",
  },
  {
    id: "cnbc-markets",
    name: "CNBC Markets",
    category: "finance",
    feedUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
  },
  {
    id: "marketwatch",
    name: "MarketWatch",
    category: "finance",
    feedUrl: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
  {
    id: "google-finance",
    name: "Google 新闻 · 金融",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
  {
    id: "bbc-health",
    name: "BBC Health",
    category: "health",
    feedUrl: "https://feeds.bbci.co.uk/news/health/rss.xml",
  },
  {
    id: "google-health",
    name: "Google 新闻 · 健康",
    category: "health",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
  {
    id: "google-health-en",
    name: "Google News · Health",
    category: "health",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "stat-news",
    name: "STAT News",
    category: "health",
    feedUrl: "https://www.statnews.com/feed/",
  },
];
