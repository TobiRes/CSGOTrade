import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, RedditPost} from "../../models/redditpost.model";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {Storage} from "@ionic/storage";
import {SearchUtil} from "../../utils/search-util";

@IonicPage({
  name: "home",
  segment: "home"
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  redditPosts: RedditPost[] = [];
  postTypesToFilter: string[] = [];
  scrollLoadThreshold: string = "10%";
  currentPage: string = "Hot";
  activeUserCount: number = 0;

  private backupPosts: RedditPost[] = [];
  private lastThreadName: string;
  private threadCount: number = 0;
  private alreadyFound: boolean = false;

  constructor(public navCtrl: NavController,
              private redditService: RedditService,
              private threadinfoService: ThreadinfoService,
              private storage: Storage) {
    this.getAllThreads();
  }

  buildSearchString(event: any) {
    let searchTerm: string;
    if (event.target) {
      searchTerm = event.target.value ? event.target.value.trim() : "";
    } else {
      searchTerm = event;
    }
    if (!searchTerm.length) {
      this.redditPosts = this.backupPosts;
    } else {
      searchTerm = searchTerm.toLowerCase();
      this.search(searchTerm);
    }
  }

  getAllThreads() {
    this.backupPosts = [];
    this.storage.get("redditPosts")
      .then(redditPosts => {
        console.log(redditPosts);
        if (redditPosts && this.currentPage == "Hot") {
          this.backupPosts = redditPosts;
          this.redditPosts = redditPosts;
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
    this.navCtrl.push("post-view", {postData});
  }

  sendTradeOffer(postData: RedditPost) {
    this.navCtrl.push("trade-their-items", {postData});
  }

  private search(searchTerm) {
    let allPosts: RedditPost[] = this.backupPosts;
    let searchedPosts: RedditPost[] = [];
    for (let n = 0; n < allPosts.length; n++) {
      Object.keys(allPosts[n]).forEach(key => {
        this.alreadyFound = false;
        if (allPosts[n][key].toString().toLowerCase().indexOf(searchTerm) > -1
          && !this.alreadyFound) {
          searchedPosts.push(allPosts[n]);
          this.alreadyFound = true;
        }
      })
    }
    searchedPosts = SearchUtil.removeDuplicatePostObjectsFromArray(searchedPosts);
    this.redditPosts = searchedPosts;
  }

  private getTradeInfo(redditPostData: any) {
    redditPostData.forEach(redditPost => {
      let tradeThread: RedditPost = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        redditURL: redditPost.data.url,
        numberOfComments: redditPost.data.num_comments,
        timeSinceCreation: this.threadinfoService.timeSince(redditPost.data.created_utc),
        content: redditPost.data.selftext,
        type: this.threadinfoService.getPostType(redditPost.data.title),
        tradelink: this.threadinfoService.getTradeUrl(redditPost.data.selftext),
        steamProfileURL: this.threadinfoService.getSteamProfileURL(redditPost.data.author_flair_text),
      };
      if (tradeThread.type == PostType.trade) {
        let buysAndSells = this.threadinfoService.getAdditionalTradeInformation(redditPost);
        tradeThread.partnerId = this.threadinfoService.getTradeParterId(tradeThread.steamProfileURL)
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
