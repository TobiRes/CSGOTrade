import {RedditPost} from "./redditpost.model";

export interface HomeSavedState {
  visiblePosts: RedditPost[];
  allPosts: RedditPost[];
  currentPage: string;
  postTypesToFilter: string[];
  lastThreadName: string;
  threadCount: number;
  loadThreshold: string;
  loadedAt: Date;
}
