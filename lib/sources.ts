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
  // —— Tech ——
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
    id: "nyt-tech",
    name: "New York Times · Tech",
    category: "tech",
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  },
  {
    id: "guardian-tech",
    name: "The Guardian · Tech",
    category: "tech",
    feedUrl: "https://www.theguardian.com/uk/technology/rss",
  },
  {
    id: "google-wsj-tech",
    name: "WSJ · Tech",
    category: "tech",
    feedUrl:
      "https://news.google.com/rss/search?q=site:wsj.com+(technology+OR+tech+OR+AI)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-reuters-tech",
    name: "Reuters · Tech",
    category: "tech",
    feedUrl:
      "https://news.google.com/rss/search?q=site:reuters.com+(technology+OR+tech+OR+semiconductor)&hl=en-US&gl=US&ceid=US:en",
  },

  // —— AI ——
  {
    id: "mit-tr",
    name: "MIT Technology Review",
    category: "ai",
    feedUrl: "https://www.technologyreview.com/feed/",
  },
  {
    id: "ars-ai",
    name: "Ars Technica",
    category: "ai",
    feedUrl: "https://feeds.arstechnica.com/arstechnica/index",
  },
  {
    id: "google-ai",
    name: "Google News · AI",
    category: "ai",
    feedUrl:
      "https://news.google.com/rss/search?q=artificial+intelligence+OR+OpenAI+OR+Anthropic+OR+LLM&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-nyt-ai",
    name: "NYT · AI",
    category: "ai",
    feedUrl:
      "https://news.google.com/rss/search?q=site:nytimes.com+(artificial+intelligence+OR+OpenAI+OR+ChatGPT)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-bloomberg-ai",
    name: "Bloomberg · AI",
    category: "ai",
    feedUrl:
      "https://news.google.com/rss/search?q=site:bloomberg.com+(artificial+intelligence+OR+OpenAI+OR+Anthropic)&hl=en-US&gl=US&ceid=US:en",
  },

  // —— Finance ——
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
    id: "cnbc-top",
    name: "CNBC Top News",
    category: "finance",
    feedUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
  },
  {
    id: "marketwatch",
    name: "MarketWatch",
    category: "finance",
    feedUrl: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
  {
    id: "nyt-business",
    name: "New York Times · Business",
    category: "finance",
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
  },
  {
    id: "google-wsj",
    name: "Wall Street Journal",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/search?q=site:wsj.com+(markets+OR+stocks+OR+economy+OR+Fed)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-bloomberg",
    name: "Bloomberg",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/search?q=site:bloomberg.com+(markets+OR+stocks+OR+economy)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-ft",
    name: "Financial Times",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/search?q=site:ft.com+(markets+OR+economy+OR+finance)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-reuters-biz",
    name: "Reuters · Business",
    category: "finance",
    feedUrl:
      "https://news.google.com/rss/search?q=site:reuters.com+(markets+OR+stocks+OR+economy)&hl=en-US&gl=US&ceid=US:en",
  },

  // —— Health ——
  {
    id: "bbc-health",
    name: "BBC Health",
    category: "health",
    feedUrl: "https://feeds.bbci.co.uk/news/health/rss.xml",
  },
  {
    id: "nyt-health",
    name: "New York Times · Health",
    category: "health",
    feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
  },
  {
    id: "stat-news",
    name: "STAT News",
    category: "health",
    feedUrl: "https://www.statnews.com/feed/",
  },
  {
    id: "guardian-health",
    name: "The Guardian · Health",
    category: "health",
    feedUrl: "https://www.theguardian.com/society/health/rss",
  },
  {
    id: "google-health-en",
    name: "Google News · Health",
    category: "health",
    feedUrl:
      "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "google-reuters-health",
    name: "Reuters · Health",
    category: "health",
    feedUrl:
      "https://news.google.com/rss/search?q=site:reuters.com+(health+OR+medicine+OR+FDA)&hl=en-US&gl=US&ceid=US:en",
  },
];
