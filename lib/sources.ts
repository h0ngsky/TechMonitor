export type NewsCategory = "tech" | "hardware" | "ai" | "finance" | "us-markets" | "world";

export type NewsSource = {
  id: string;
  name: string;
  category: NewsCategory;
  feedUrl: string;
};

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  tech: "科技",
  hardware: "硬件",
  ai: "AI",
  finance: "金融",
  "us-markets": "美股",
  world: "国际",
};

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
    id: "bbc-tech",
    name: "BBC Technology",
    category: "tech",
    feedUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  },
  {
    id: "engadget",
    name: "Engadget",
    category: "hardware",
    feedUrl: "https://www.engadget.com/rss.xml",
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    category: "hardware",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/index",
  },
  {
    id: "google-hardware",
    name: "Google 新闻 · 芯片硬件",
    category: "hardware",
    feedUrl:
      "https://news.google.com/rss/search?q=semiconductor+OR+chip+OR+GPU+OR+NVIDIA+OR+TSMC&hl=en-US&gl=US&ceid=US:en",
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
    id: "bbc-business",
    name: "BBC Business",
    category: "finance",
    feedUrl: "https://feeds.bbci.co.uk/news/business/rss.xml",
  },
  {
    id: "marketwatch",
    name: "MarketWatch",
    category: "finance",
    feedUrl: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
  {
    id: "cnbc-markets",
    name: "CNBC Markets",
    category: "us-markets",
    feedUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
  },
  {
    id: "google-us-markets",
    name: "Google 新闻 · 美股",
    category: "us-markets",
    feedUrl:
      "https://news.google.com/rss/search?q=NASDAQ+OR+S%26P+500+OR+Dow+Jones+OR+US+stocks&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "bbc-world",
    name: "BBC World",
    category: "world",
    feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
  {
    id: "google-world",
    name: "Google 新闻 · 国际",
    category: "world",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/WORLD?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
];
