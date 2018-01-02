import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RedditService {

  private globalOffensiveTradeBaseUrl: string = "https://www.reddit.com/r/globaloffensivetrade/";
  constructor(private http: HttpClient) {
  }

  getRedditThreads() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveTradeBaseUrl + "hot.json").subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.children);
          })
      } catch (error) {
        reject(error);
      }
    })
  }

  getNextRedditThreads(threadCount: number, lastThreadName: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(this.globalOffensiveTradeBaseUrl + ".json?count=" + threadCount + "&after=" + lastThreadName).subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.children);
          })
      } catch (error) {
        reject(error);
      }
    })
  }
}
