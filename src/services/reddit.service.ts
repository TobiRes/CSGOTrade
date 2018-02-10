import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RedditComment, RedditPost} from "../models/redditpost.model";

@Injectable()
export class RedditService {


  private globalOffensiveAboutURL: string = "http://www.reddit.com/r/Globaloffensivetrade/about.json"
  private globalOffensiveTradeBaseURL: string = "https://www.reddit.com/r/globaloffensivetrade/";
  private globalOffensiveSearchBaseURL: string = "https://www.reddit.com/r/GlobalOffensiveTrade/search.json?q="

  constructor(private http: HttpClient) {
  }

  getActiveUserCount() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveAboutURL).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.active_user_count);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  getRedditThreads(currentPage: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveTradeBaseURL + currentPage.toLowerCase() + ".json").subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  getComments(redditPost: RedditPost) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(redditPost.redditURL + ".json").subscribe(
          (redditCommentData: any) => {
            let allPostComments: RedditComment[] = this.getCommentData(redditCommentData[1].data.children);
            let postUpdate = {
              allPostComments: allPostComments,
              upvoteRatio: redditCommentData[0].data.children[0].data.upvote_ratio * 100
            }
            resolve(postUpdate);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  getNextRedditThreads(threadCount: number, lastThreadName: string, currentPage: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveTradeBaseURL + currentPage.toLowerCase() + "/.json?count=" + threadCount + "&after=" + lastThreadName).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  getNextSearchThreads(threadCount: number, lastThreadName: string, searchTerm: string[], additionalDetails: string) {
    return new Promise((resolve, reject) => {
      try {
        let searchSpecification = this.getSearchSpecification(searchTerm);
        this.http.get(this.globalOffensiveSearchBaseURL + searchSpecification + additionalDetails + "/.json?count=" + threadCount + "&after=" + lastThreadName).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  searchSubreddit(searchTerm: string[], additionalDetails: string) {
    return new Promise((resolve, reject) => {
      try {
        let searchSpecification = this.getSearchSpecification(searchTerm);
        this.http.get(this.globalOffensiveSearchBaseURL + searchSpecification + additionalDetails).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  private getCommentData(commentData: any[]) {
    let postComments: RedditComment[] = [];
    commentData.forEach(comment => {
      let commentTree: RedditComment = this.getWholeCommentTree(comment.data);
      if(commentTree.author)
        postComments.push(this.getWholeCommentTree(comment.data))
    })
    return postComments;
  }

  private getWholeCommentTree(comment): RedditComment {
    return {
      author: comment.author,
      body: comment.body,
      score: comment.score,
      ups: comment.ups,
      downs: comment.downs,
      replies: comment.replies ? this.getCommentData(comment.replies.data.children) : []
    };
  }

  private getSearchSpecification(searchTerm: string[]) {
    let searchSpecification = searchTerm[0];
    for (let i = 1; i < searchTerm.length; i++) {
      searchSpecification += "+" + searchTerm[i];
    }
    return searchSpecification;
  }
}
