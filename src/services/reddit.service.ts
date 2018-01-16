import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RedditService {

  //Comment URL = POSTURL /.json

  private globalOffensiveAboutURL: string = "http://www.reddit.com/r/Globaloffensivetrade/about.json"
  private globalOffensiveTradeBaseUrl: string = "https://www.reddit.com/r/globaloffensivetrade/";

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
        this.http.get(this.globalOffensiveTradeBaseUrl + currentPage.toLowerCase() + ".json").subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.children);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  getNextRedditThreads(threadCount: number, lastThreadName: string, currentPage: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveTradeBaseUrl + currentPage.toLowerCase() + "/.json?count=" + threadCount + "&after=" + lastThreadName).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.children);
          })
      } catch (error) {
        reject(error);
      }
    });
  }
}
