import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, RedditPost} from "../../models/redditpost.model";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {Storage} from "@ionic/storage";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {PostViewPage} from "../post-view/post-view";
import {HomeSavedState} from "../../models/homeSavedState.model";

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
  isLoading: boolean = true;

  private backupPosts: RedditPost[] = [];
  private lastThreadName: string;
  private threadCount: number = 0;
  private loadedAtTime: Date;

  constructor(public navCtrl: NavController,
              private redditService: RedditService,
              private threadinfoService: ThreadinfoService,
              private storage: Storage) {
    this.initializeView();
  }

  ionViewWillLeave() {
    this.backupPosts = this.backupPosts.slice(0, 25);
    let savedState: HomeSavedState = {
      visiblePosts: this.redditPosts,
      allPosts: this.backupPosts,
      currentPage: this.currentPage,
      postTypesToFilter: this.postTypesToFilter,
      lastThreadName: this.lastThreadName,
      threadCount: this.threadCount,
      loadThreshold: this.scrollLoadThreshold,
      loadedAt: this.loadedAtTime

    }
    this.storage.set("savedState", savedState);
  }

  initializeView() {
    this.storage.get("savedState")
      .then((savedState: HomeSavedState) => {
        if (!savedState || this.threadinfoService.checkIfAnyObjectPropertyIsUndefined(savedState) || this.loadedMoreThanOneHourAgo(savedState.loadedAt)) {
          this.resetViewAndData();
        } else {
          this.setData(savedState);
        }
        this.isLoading = false;
      })
      .catch(error => {
        this.resetViewAndData();
        console.error(error)
      });
  }

  getRedditThreads() {
    this.redditService.getRedditThreads(this.currentPage)
      .then(redditPostData => {
        this.backupPosts = [];
        this.getTradeInfo(redditPostData)
        this.isLoading = false;
        this.loadedAtTime = new Date();
      })
      .catch(error => console.error(error));
  }

  refreshPosts(refresher: any) {
    setTimeout(() => {
      this.redditService.getRedditThreads(this.currentPage)
        .then(redditPostData => {
          this.backupPosts = [];
          this.getTradeInfo(redditPostData);
          this.loadedAtTime = new Date();
          refresher.complete();
        })
        .catch(error => {
          refresher.complete();
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

  isTradeOrStore(postType: PostType): boolean {
    return (postType == PostType.trade || postType == PostType.store);
  }

  openPost(postData: RedditPost) {
    this.navCtrl.push(PostViewPage, {postData});
  }

  sendTradeOffer(postData: RedditPost) {
    this.navCtrl.push(TradeTheirItemsPage, {postData});
  }

  private loadedMoreThanOneHourAgo(loadedAt: Date): boolean {
    if(!loadedAt){
      return true;
    }
    let hours = Math.abs(new Date().getTime() - loadedAt.getTime()) / 3600000;
    return hours < 2;
  }

  private setData(savedState: HomeSavedState) {
    this.backupPosts = savedState.allPosts;
    this.redditPosts = savedState.visiblePosts;
    this.currentPage = savedState.currentPage;
    this.postTypesToFilter = savedState.postTypesToFilter;
    this.lastThreadName = savedState.lastThreadName;
    this.threadCount = savedState.threadCount;
    this.scrollLoadThreshold = savedState.loadThreshold;
  }

  private resetViewAndData() {
    this.backupPosts = [];
    this.redditPosts = [];
    this.currentPage = "Hot";
    this.postTypesToFilter = [];
    this.lastThreadName = "";
    this.scrollLoadThreshold = "10%";
    this.threadCount = 0;
    this.lastThreadName = "";
    this.getRedditThreads();
  }

  private getTradeInfo(redditPostData: any) {
    this.backupPosts = this.threadinfoService.setRedditPostInfo(this.backupPosts, redditPostData);

    this.setMetaData(redditPostData);
    if (this.postTypesToFilter.length) {
      this.filterPosts();
    }
  }

  private setMetaData(redditPostData: any) {
    this.redditPosts = this.backupPosts;
    this.defineThresholdForLoadingMorePosts();
    this.lastThreadName = redditPostData.after;
    this.threadCount = this.threadCount + 25;
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
