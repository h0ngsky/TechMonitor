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
    id: "google-tech-zh",
    name: "Google 新闻 · 科技",
    category: "tech",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
  {
    id: "bbc-tech",
    name: "BBC Technology",
    category: "tech",
    feedUrl: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  },
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
    id: "google-hardware",
    name: "Google 新闻 · 芯片硬件",
    category: "hardware",
    feedUrl:
      "https://news.google.com/rss/search?q=semiconductor+OR+chip+OR+GPU+OR+NVIDIA+OR+TSMC&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    category: "hardware",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/technology-lab",
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
    id: "hn-ai",
    name: "Hacker News · AI",
    category: "ai",
    feedUrl: "https://hnrss.org/newest?q=AI+OR+LLM+OR+OpenAI",
  },
  {
    id: "bbc-business",
    name: "BBC Business",
    category: "finance",
    feedUrl: "https://feeds.bbci.co.uk/news/business/rss.xml",
  },
  {
    id: "google-finance",
    name: "Google 新闻 · 金融",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
  {
    id: "google-us-markets",
    name: "Google 新闻 · 美股",
    category: "us-markets",
    feedUrl:
      "https://news.google.com/rss/search?q=NASDAQ+OR+S%26P+500+OR+Dow+Jones+OR+US+stocks&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "cnbc-markets",
    name: "CNBC Markets",
    category: "us-markets",
    feedUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
  },
  {
    id: "google-world",
    name: "Google 新闻 · 国际",
    category: "world",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/WORLD?hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
  },
];
