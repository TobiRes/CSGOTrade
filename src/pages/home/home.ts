import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, RedditPost} from "../../models/redditpost.model";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {Storage} from "@ionic/storage";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {PostViewPage} from "../post-view/post-view";
import {SavedState} from "../../models/savedState.model";

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
    this.initializeView();
  }

  ionViewWillLeave() {
    let savedState: SavedState = {
      visiblePosts: this.redditPosts,
      allPosts: this.backupPosts,
      currentPage: this.currentPage,
      postTypesToFilter: this.postTypesToFilter,
      lastThreadName: this.lastThreadName,
      threadCount: this.threadCount,
      loadThreshold: this.scrollLoadThreshold
    }
    this.storage.set("savedState", savedState);
  }

  initializeView() {
    this.storage.get("savedState")
      .then((savedState: SavedState) => {
        if(!savedState || this.anySavedStatePropertyIsUndefined(savedState)){
          this.resetViewAndData();
        }
        else {
          this.setData(savedState);
        }
      })
      .catch(error => {
        this.resetViewAndData();
        console.error(error)
      });
  }

  getRedditThreads(){
    this.redditService.getRedditThreads(this.currentPage)
      .then(redditPostData => {
        this.backupPosts = [];
        this.getTradeInfo(redditPostData)
      })
      .catch(error => console.error(error));
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

  private anySavedStatePropertyIsUndefined(savedState: SavedState): boolean {
    let savedStateIsNotComplete: boolean = false;
    for (var property in savedState) {
      if(savedState[property] === "undefined"){
        savedStateIsNotComplete = true;
      }
    }
    return savedStateIsNotComplete;
  }

  private setData(savedState: SavedState){
    this.backupPosts = savedState.allPosts;
    this.redditPosts = savedState.visiblePosts;
    this.currentPage = savedState.currentPage;
    this.postTypesToFilter = savedState.postTypesToFilter;
    this.lastThreadName = savedState.lastThreadName;
    this.threadCount = savedState.threadCount;
    this.scrollLoadThreshold = savedState.loadThreshold;
  }

  private resetViewAndData(){
    this.redditPosts = [];
    this.currentPage = "Hot";
    this.postTypesToFilter = [];
    this.lastThreadName = "";
    this.scrollLoadThreshold = "10%";
    this.getRedditThreads();
  }

  private getTradeInfo(redditPostData: any) {
    this.backupPosts = this.threadinfoService.setRedditPostInfo(this.backupPosts, redditPostData);

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
    this.lastThreadName = redditPostData.after;
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
