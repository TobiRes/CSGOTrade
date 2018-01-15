import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RedditService} from "../../services/reddit.service";
import {PostType, RedditPost} from "../../models/redditpost.model";
import {ThreadinfoService} from "../../services/threadinfo.service";
import {Storage} from "@ionic/storage";

@IonicPage({
  name: "home",
  segment: ""
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
  searchInput: string = "";

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

  buildSearchTerm(event){
    let searchTerm: string;
    if (event.target) {
      searchTerm = event.target.value ? event.target.value.trim().toLowerCase() : "";
    } else {
      searchTerm = event;
    }
    let searchTermArray: string[]= searchTerm.split(" ");
    this.search(searchTermArray);
  }

  private search(searchTermArray){
    let searchedPosts: RedditPost[] = [];
    console.log(searchTermArray)
    for(let i = 0; i < searchTermArray.length; i++){
      for(let n = 0; n < this.redditPosts.length; n++){
        Object.keys(this.redditPosts[n]).forEach( key => {
          console.log(this.redditPosts[n][key]);
          this.alreadyFound = false;
          if(this.redditPosts[n][key].toString().toLowerCase().indexOf(searchTermArray[i]) > -1
          && !this.alreadyFound){
            searchedPosts.push(this.redditPosts[n]);
            this.alreadyFound = true;
          }
        })
      }
    }
    this.redditPosts = searchedPosts;
  }

  getAllThreads() {
    this.backupPosts = [];
    this.storage.get("redditPosts")
      .then(redditPosts => {
        console.log(redditPosts);
        if (redditPosts && this.currentPage == "Hot") {
          this.redditPosts = redditPosts;
        } else {
          this.scrollLoadThreshold = "10%";
          this.redditService.getRedditThreads(this.currentPage)
            .then(redditPostData => {
              console.log("redditPost", redditPostData)
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
    this.navCtrl.push("trade-my-items", {postData});
  }

  private getTradeInfo(redditPostData: any) {
    redditPostData.forEach(redditPost => {
      let tradeThread: RedditPost = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        redditURL: redditPost.data.url,
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
    if(this.currentPage == "Hot"){
      this.storage.set("redditPosts", this.backupPosts);
    }
  }

  private checkIfPostIsFiltered(postType: PostType): boolean {
    let filtered: boolean = false;
    this.postTypesToFilter.forEach(type => {
      switch (type) {
        case "RedditPost":
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
