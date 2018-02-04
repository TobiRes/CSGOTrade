export interface RedditPost {
  redditURL: string;
  author: string;
  type: PostType;
  title: string;
  content: string;
  timeSinceCreation: string;
  numberOfComments: string;
  tradelink?: string;
  steamProfileURL?: string;
  partnerId?: string;
  screenshotUrl?: string[];
  has?: string;
  wants?: string;
  ups?: number;
  downs?: number;
  likedIt?: number;
  score?: number;
}

export interface RedditComment {
  author: string;
  body?: string;
  score?: number;
  ups?: number;
  downs?: number;
  timeSinceCreation?: string;
  steamProfile?: string;
  replies?: RedditComment[];
}

export enum PostType {
  trade = <any> "trade",
  store = <any> "store",
  pricecheck = <any> "pricecheck",
  discussion = <any> "discussion",
  question = <any> "question",
  lph = <any> "lph",
  psa = <any> "psa",
  free = <any> "free",
  important = <any> "important",
  unknown = <any> "unknown"
}
