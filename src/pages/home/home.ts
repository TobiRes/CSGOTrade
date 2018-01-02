import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {Trade} from "../../models/trade.model";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tradePosts: Trade[] = [];

  constructor(public navCtrl: NavController, private redditService: RedditService) {
    this.getAllThreads();
  }

  private getAllThreads() {
    this.redditService.getRedditThreads()
      .then(redditPostData => this.getTradeInfo(redditPostData))
      .catch(error => console.error(error));
  }


  private getTradeInfo(redditPostData: any) {
    redditPostData.forEach( redditPost => {
      let tradeThread: Trade = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        url: redditPost.data.url,
        content: redditPost.data.selftext
      };
      tradeThread.tradelink = this.getTradeUrl(tradeThread.content);
/*      tradeThread.buyout = this.getTradeBuyout(tradeThread.content);
      tradeThread.screenshotUrl = this.getScreenshotUrl(tradeThread.content);*/
      this.tradePosts.push(tradeThread);
    });
    console.log(this.tradePosts);
  }

  private getTradeUrl(threadContent: string) {
    let tradeOfferBaseURL = "https://steamcommunity.com/tradeoffer/new/?";
    if(!(threadContent.match(/partner=[0-9]*/g) && threadContent.match(/(token=[-0-9a-zA-Z_]*)/g))){
      return "";
    }
    let tradePartner: string = threadContent.match(/partner=[0-9]*/g)[0];
    let tradeToken: string = threadContent.match(/(token=[-0-9a-zA-Z_]*)/g)[0];
    return tradeOfferBaseURL + tradePartner + "&amp;" + tradeToken;
  }

  private getScreenshotUrl(threadContent: string) {

  }

  private getTradeBuyout(threadContent: string) {

  }
}
