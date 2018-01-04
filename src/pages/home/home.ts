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
  postTypesToFilter: string[] = [];
  scrollLoadThreshold: string = "10%";
  currentPage: string = "Hot";

  private backupPosts: Trade[] = [];
  private lastThreadName: string;
  private threadCount: number = 0;

  constructor(public navCtrl: NavController, private redditService: RedditService, private threadinfoService: ThreadinfoService) {
    this.getAllThreads();
  }

  getAllThreads() {
    this.backupPosts = [];
    this.redditService.getRedditThreads(this.currentPage)
      .then(redditPostData => this.getTradeInfo(redditPostData))
      .catch(error => console.error(error));
  }

  refreshPosts(refresher: any){
      setTimeout(() => {
        this.redditService.getRedditThreads(this.currentPage)
          .then(redditPostData => {
            this.backupPosts = [];
            this.getTradeInfo(redditPostData);
            refresher.complete();
          })
          .catch(error => {
            console.error(error);
          });
      }, 2000);
  }

  loadAdditionalThreads(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.redditService.getNextRedditThreads(this.threadCount, this.lastThreadName, this.currentPage)
          .then(redditPostData => {
            this.getTradeInfo(redditPostData);
            resolve();
          })
          .catch(error => {
            console.error(error);
            reject();
          });
      }, 1000);
    });
  }

  filterPosts() {
    this.tradePosts = this.backupPosts;
    if (this.postTypesToFilter.length) {
      this.tradePosts = this.tradePosts.filter(post => {
        if (this.checkIfPostIsFiltered(post.type)) {
          return true;
        }
        return false;
      });
      this.defineThresholdForLoadingMorePosts();
    }
  }

  isTrade(postType: PostType): boolean {
    if (postType == PostType.trade)
      return true;
    return false;
  }

  private getTradeInfo(redditPostData: any) {
    redditPostData.forEach(redditPost => {
      let tradeThread: Trade = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        url: redditPost.data.url,
        timeSinceCreation: this.threadinfoService.timeSince(redditPost.data.created_utc),
        content: redditPost.data.selftext,
        type: this.threadinfoService.getPostType(redditPost.data.title),
        tradelink: this.threadinfoService.getTradeUrl(redditPost.data.selftext)
      };
      if (tradeThread.type == PostType.trade) {
        let buysAndSells = this.threadinfoService.getAdditionalTradeInformation(redditPost);
        tradeThread.wants = buysAndSells.wants;
        tradeThread.has = buysAndSells.has;
      }
      this.backupPosts.push(tradeThread);
    });

    this.setMetaData(redditPostData);
    if (this.postTypesToFilter.length) {
      this.filterPosts();
    }
  }

  private defineThresholdForLoadingMorePosts() {
    if (!this.tradePosts.length)
      this.scrollLoadThreshold = "100%";
    else {
      switch (this.tradePosts.length) {
        case 7:
        case 6:
          this.scrollLoadThreshold = "60%";
          break;
        case 5:
          this.scrollLoadThreshold = "70%";
          break;
        case 4:
          this.scrollLoadThreshold = "80%";
          break;
        case 3:
          this.scrollLoadThreshold = "90%";
          break;
        case 2:
        case 1:
          this.scrollLoadThreshold = "95%";
          break;
        default:
          this.scrollLoadThreshold = "10%";
          break;
      }
    }
  }

  private setMetaData(redditPostData: any) {
    this.tradePosts = this.backupPosts;
    this.defineThresholdForLoadingMorePosts();
    this.lastThreadName = redditPostData[redditPostData.length - 1].data.name;
    this.threadCount = this.threadCount + 25;
  }

  private checkIfPostIsFiltered(postType: PostType): boolean {
    let filtered: boolean = false;
    this.postTypesToFilter.forEach(type => {
      switch (type) {
        case "Trade":
          if (postType == PostType.trade)
            filtered = true;
          break;
        case "Store":
          if (postType == PostType.store)
            filtered = true;
          break;
        case "Pricecheck":
          if (postType == PostType.pricecheck)
            filtered = true;
          break;
        case "Question":
          if (postType == PostType.question)
            filtered = true;
          break;
        case "< 15 Keys":
          if (postType == PostType.lph)
            filtered = true;
          break;
        case "PSA":
          if (postType == PostType.psa)
            filtered = true;
          break;
        case "Free":
          if (postType == PostType.free)
            filtered = true;
          break;
        case "Sticky":
          if (postType == PostType.important)
            filtered = true;
          break;
        default:
          filtered = false;
          console.error("Error filtering posts");
      }
    });
    return filtered;
  }
}
