import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RedditService {

  constructor(private http: HttpClient) {
  }

  getRedditThreads() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get("https://www.reddit.com/r/globaloffensivetrade/hot.json").subscribe(
          (redditPostData: any) => {
            resolve(redditPostData.data.children);
          })
      } catch (error) {
        reject(error);
      }
    })
  }

}
