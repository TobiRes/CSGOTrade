import {RedditPost} from "../models/redditpost.model";

export class SearchUtil {

  static removeDuplicatePostObjectsFromArray(postObjects: RedditPost[]){
    postObjects = postObjects.filter((post, index, self) =>
      index === self.findIndex((t) => (
        t.title === post.title && t.tradelink === post.tradelink
      ))
    )
    return postObjects;
  }
}
