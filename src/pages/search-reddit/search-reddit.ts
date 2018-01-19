import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {PostType, RedditPost} from "../../models/redditpost.model";
import {RedditService} from "../../services/reddit.service";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {Storage} from "@ionic/storage";

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
    //TODO: ONLY SAVE POST AND LAST THREAD COUNT FOR A CERTAIN TIME
    Promise.all([this.storage.get("searchedPosts"), this.storage.get("searchTerm"), this.storage.get("lastSearchThreadName"), this.storage.get("searchThreadCount")])
      .then(storageData => {
        this.redditPosts = storageData[0];
        this.getSearchTermFromSavedSearchTermArray(storageData[1]);
        this.lastThreadName = storageData[2];
        this.threadCount = storageData[3];
        if (this.searchbarInput && !this.redditPosts) {
          this.search();
        }
      })
      .catch(error => console.error(error));
  }

  refreshPosts(refresher: any) {
    setTimeout(() => {
      this.redditService.searchSubreddit(this.savedSearchTerm, this.getCertainKindOfPostsString())
        .then(redditPostsData => {
          if (redditPostsData) {
            this.backupPosts = [];
            this.getTradeInfo(redditPostsData)
          } else {
            //TODO: ALERT NO FOUND!
          }
        });
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
        this.redditService.getNextSearchThreads(this.threadCount, this.lastThreadName,searchTermArray, additionalDetails)
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

  private buildSearchString() {
    let searchTerm: string;
    let searchTermArray: string[];
    if (this.searchbarInput) {
      searchTerm = this.searchbarInput.trim();
      searchTermArray = searchTerm.toLowerCase().split(" ");
    } else if(this.savedSearchTerm) {
      searchTermArray = this.savedSearchTerm;
    } else {
      searchTermArray = [""];
    }
    this.savedSearchTerm = searchTermArray;
    return searchTermArray;
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
    this.buildSearchString();
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
    this.backupPosts = this.threadInfoService.getTradeInfo(this.backupPosts, redditPostData)
    this.setMetaData(redditPostData);
  }

  private setMetaData(redditPostData: any) {
    this.redditPosts = this.backupPosts;
    this.defineThresholdForLoadingMorePosts();
    this.lastThreadName = redditPostData[redditPostData.length - 1].data.name;
    this.threadCount = this.threadCount + 25;
    this.storage.set("searchedPosts", this.backupPosts);
    this.storage.set("searchTerm", this.savedSearchTerm);
    this.storage.set("lastSearchThreadName", this.lastThreadName);
    this.storage.set("searchThreadCount", this.threadCount);
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

  private getSearchTermFromSavedSearchTermArray(savedSearchTerm: string[]) {
    this.searchbarInput = "";
    savedSearchTerm.forEach(word => {
      this.searchbarInput += " " + word;
    })
    this.searchbarInput.trim();
  }

}
