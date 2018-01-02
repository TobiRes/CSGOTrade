import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, Trade} from "../../models/trade.model";
import {ThreadinfoService} from "../../services/threadinfo.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tradePosts: Trade[] = [];

  constructor(public navCtrl: NavController, private redditService: RedditService, private threadinfoService: ThreadinfoService) {
    this.getAllThreads();
  }

  private getAllThreads() {
    this.redditService.getRedditThreads()
      .then(redditPostData => this.getTradeInfo(redditPostData))
      .catch(error => console.error(error));
  }


  private getTradeInfo(redditPostData: any) {
    redditPostData.forEach(redditPost => {
      let tradeThread: Trade = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        url: redditPost.data.url,
        content: redditPost.data.selftext,
        type: this.threadinfoService.getPostType(redditPost.data.title),
        tradelink: this.threadinfoService.getTradeUrl(redditPost.data.selftext)
      };
      this.tradePosts.push(tradeThread);
    });
  }

  openTrade() {

  }

  isTrade(postType: PostType): boolean {
    if (postType != PostType.trade)
      return false;
    return true;
  }

}
