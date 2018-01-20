import {RedditPost} from "./redditpost.model";

export interface SavedState {
  visiblePosts: RedditPost[];
  allPosts: RedditPost[];
  currentPage: string;
  postTypesToFilter: string[];
  lastThreadName: string;
  threadCount: number;
  loadThreshold: string;
}
