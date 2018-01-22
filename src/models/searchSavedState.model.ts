import {RedditPost} from "./redditpost.model";

export interface SearchedSavedState {
  visiblePosts: RedditPost[];
  allPosts: RedditPost[];
  searchInput: string;
  searchTerm: string[];
  sortBy: string;
  chosenTime: string;
  lastThreadName: string;
  threadCount: number;
  loadThreshold: string;
}
