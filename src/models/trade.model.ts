export interface Trade {
  url: string;
  author: string;
  title: string;
  content: string;
  buyout?: string;
  tradelink?: string;
  screenshotUrl?: string[];
  has?: string;
  wants?: string;
  type: PostType;
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
