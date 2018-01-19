import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, RedditPost} from "../../models/redditpost.model";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {Storage} from "@ionic/storage";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {PostViewPage} from "../post-view/post-view";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  redditPosts: RedditPost[] = [];
  postTypesToFilter: string[] = [];
  scrollLoadThreshold: string = "10%";
  currentPage: string = "Hot";

  private backupPosts: RedditPost[] = [];
  private lastThreadName: string;
  private threadCount: number = 0;

  constructor(public navCtrl: NavController,
              private redditService: RedditService,
              private threadinfoService: ThreadinfoService,
              private storage: Storage) {
    this.getAllThreads();
  }

  getAllThreads() {
    this.backupPosts = [];
    Promise.all([this.storage.get("redditPosts"), this.storage.get("lastThreadName"), this.storage.get("threadCount")])
      .then(storageData => {
        if (storageData[0] && storageData[1] && storageData[2] && this.currentPage == "Hot") {
          this.backupPosts = storageData[0];
          this.redditPosts = storageData[0];
          this.lastThreadName = storageData[1];
          this.threadCount = storageData[2]
        } else {
          this.scrollLoadThreshold = "10%";
          this.redditService.getRedditThreads(this.currentPage)
            .then(redditPostData => {
              this.backupPosts = [];
              this.getTradeInfo(redditPostData)
            })
            .catch(error => console.error(error));
        }
      })
      .catch(error => console.log(error))
  }

  refreshPosts(refresher: any) {
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
    this.redditPosts = this.backupPosts;
    if (this.postTypesToFilter.length) {
      this.redditPosts = this.redditPosts.filter(post => {
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

  openPost(postData: RedditPost) {
    this.navCtrl.push(PostViewPage, {postData});
  }

  sendTradeOffer(postData: RedditPost) {
    this.navCtrl.push(TradeTheirItemsPage, {postData});
  }

  private getTradeInfo(redditPostData: any) {
    this.backupPosts = this.threadinfoService.getTradeInfo(this.backupPosts, redditPostData)
    this.setMetaData(redditPostData);
    if (this.postTypesToFilter.length) {
      this.filterPosts();
    }
  }

  private defineThresholdForLoadingMorePosts() {
    if (!this.redditPosts.length)
      this.scrollLoadThreshold = "100%";
    else {
      switch (this.redditPosts.length) {
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
    this.redditPosts = this.backupPosts;
    this.defineThresholdForLoadingMorePosts();
    this.lastThreadName = redditPostData[redditPostData.length - 1].data.name;
    this.threadCount = this.threadCount + 25;
    if (this.currentPage == "Hot") {
      this.storage.set("redditPosts", this.backupPosts);
      this.storage.set("lastThreadName", this.lastThreadName);
      this.storage.set("threadCount", this.threadCount);
    }
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
