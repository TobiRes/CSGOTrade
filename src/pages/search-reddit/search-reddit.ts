import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {PostType, RedditPost} from "../../models/redditpost.model";
import {RedditService} from "../../services/reddit.service";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {Storage} from "@ionic/storage";
import {SearchedSavedState} from "../../models/searchSavedState.model";
import {HomeSavedState} from "../../models/homeSavedState.model";
import {createElementCssSelector} from "@angular/compiler";

@IonicPage()
@Component({
  selector: 'page-search-reddit',
  templateUrl: 'search-reddit.html',
})
export class SearchRedditPage {

  redditPosts: RedditPost[] = [];
  chosenTime: string = "Week";
  scrollLoadThreshold: string = "10%";
  sortBy: string = "Relevance";
  searchbarInput: string = "";

  private savedSearchTerm: string[] = []
  private backupPosts: RedditPost[] = [];
  private lastThreadName: string;
  private threadCount: number = 0;

  constructor(public navCtrl: NavController, private storage: Storage, private redditService: RedditService, private threadInfoService: ThreadinfoService) {
    this.initializeView();
  }

  ionViewWillLeave() {
    let searchSavedState: SearchedSavedState = {
      visiblePosts: this.redditPosts,
      allPosts: this.backupPosts,
      sortBy: this.sortBy,
      chosenTime: this.chosenTime,
      searchInput: this.searchbarInput,
      searchTerm: this.savedSearchTerm,
      lastThreadName: this.lastThreadName,
      threadCount: this.threadCount,
      loadThreshold: this.scrollLoadThreshold
    }
    this.storage.set("searchSavedState", searchSavedState);
  }

  initializeView() {
    this.storage.get("searchSavedState")
      .then((searchSavedState: SearchedSavedState) => {
        if(!searchSavedState || this.threadInfoService.checkIfAnyObjectPropertyIsUndefined(searchSavedState)){
          this.resetViewAndData();
        }
        else {
          this.setData(searchSavedState);
        }
      })
      .catch(error => {
        this.resetViewAndData();
        console.error(error)
      });
  }

  private setData(savedState: SearchedSavedState){
    this.backupPosts = savedState.allPosts;
    this.redditPosts = savedState.visiblePosts;
    this.sortBy = savedState.sortBy;
    this.chosenTime = savedState.chosenTime;
    this.searchbarInput = savedState.searchInput;
    this.savedSearchTerm = savedState.searchTerm;
    this.lastThreadName = savedState.lastThreadName;
    this.threadCount = savedState.threadCount;
    this.scrollLoadThreshold = savedState.loadThreshold;
  }

  private resetViewAndData(){
    this.backupPosts = [];
    this.redditPosts = [];
    this.sortBy = "Relevance";
    this.chosenTime = "Week";
    this.searchbarInput = "";
    this.savedSearchTerm = [];
    this.lastThreadName = "";
    this.threadCount = 0;
    this.scrollLoadThreshold = "10%";
  }

  refreshPosts(refresher: any) {
    setTimeout(() => {
      if(this.savedSearchTerm){
        this.redditService.searchSubreddit(this.savedSearchTerm, this.getCertainKindOfPostsString())
          .then(redditPostsData => {
            refresher.complete();
            if (redditPostsData) {
              this.backupPosts = [];
              this.getTradeInfo(redditPostsData)
            } else {
              //TODO: ALERT NO FOUND!
            }
          });
      }
      else{
        refresher.complete();
        //TODO: ALERT PLEASE ENTER SEARCH
      }
    }, 2000);
  }

  search() {
    let searchTermArray: string[] = this.buildSearchString();
    let additionalDetails = this.getCertainKindOfPostsString()
    this.redditService.searchSubreddit(searchTermArray, additionalDetails)
      .then(redditPostsData => {
        if (redditPostsData) {
          this.backupPosts = [];
          this.getTradeInfo(redditPostsData)
        } else {
          //TODO: ALERT NO FOUND!
        }
      });
  }

  loadAdditionalThreads(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let searchTermArray: string[] = this.searchbarInput ? this.buildSearchString() : this.savedSearchTerm;
        let additionalDetails = this.getCertainKindOfPostsString()
        this.redditService.getNextSearchThreads(this.threadCount, this.lastThreadName, searchTermArray, additionalDetails)
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

  isTrade(postType: PostType): boolean {
    if (postType == PostType.trade)
      return true;
    return false;
  }

  sendTradeOffer(postData: RedditPost) {
    this.navCtrl.push(TradeTheirItemsPage, {postData});
  }

  filterPosts() {
    this.search();
  }

  private buildSearchString() {
    let searchTerm: string;
    let searchTermArray: string[];
    if (this.searchbarInput) {
      searchTerm = this.searchbarInput.trim();
      searchTermArray = searchTerm.toLowerCase().split(" ");
    } else if (this.savedSearchTerm) {
      searchTermArray = this.savedSearchTerm;
    } else {
      searchTermArray = [""];
    }
    this.savedSearchTerm = searchTermArray;
    return searchTermArray;
  }

  private getCertainKindOfPostsString() {
    let additionalPostTypeInfo: string = "";
    switch (this.sortBy) {
      case "New":
        additionalPostTypeInfo = "&sort=new";
        break;
      case "Relevance":
        additionalPostTypeInfo = "&sort=relevance";
        break;
      case "Top":
        additionalPostTypeInfo = "&sort=top";
        break;
      case "Total Comments":
        additionalPostTypeInfo = "&sort=comments";
        break;
      default:
        additionalPostTypeInfo = "";
        break;
    }

    additionalPostTypeInfo += "&restrict_sr=on";

    switch (this.chosenTime) {
      case "Hour":
        additionalPostTypeInfo += "&t=hour";
        break;
      case "Day":
        additionalPostTypeInfo += "&t=day";
        break;
      case "Week":
        additionalPostTypeInfo += "&t=week";
        break;
      case "Month":
        additionalPostTypeInfo += "&t=month";
        break;
      case "Year":
        additionalPostTypeInfo += "&t=year";
        break;
      case "All Time":
        additionalPostTypeInfo += "&t=all";
        break;
      default:
        additionalPostTypeInfo += "";
        break;
    }

    return additionalPostTypeInfo;
  }

  private getTradeInfo(redditPostData: any) {
    this.backupPosts = this.threadInfoService.setRedditPostInfo(this.backupPosts, redditPostData)
    this.setMetaData(redditPostData);
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

}
