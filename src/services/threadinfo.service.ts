import {Injectable} from "@angular/core";
import {PostType, RedditPost} from "../models/redditpost.model";

@Injectable()
export class ThreadinfoService {

  constructor() {
  }

  setRedditPostInfo(existingRedditPosts: RedditPost[], redditPostData: any) {
    if (redditPostData.children.length) {
      redditPostData.children.forEach(redditPost => {
        let actualPostData = redditPost.data;
        let tradeThread: RedditPost = {
          title: actualPostData.title,
          author: actualPostData.author,
          redditURL: actualPostData.url,
          numberOfComments: actualPostData.num_comments,
          score: actualPostData.score,
          timeSinceCreation: this.timeSince(actualPostData.created_utc),
          content: actualPostData.selftext,
          type: this.getPostType(actualPostData.title),
          tradelink: this.getTradeUrl(actualPostData.selftext),
          steamProfileURL: this.getSteamProfileURL(actualPostData.author_flair_text),
          closed: actualPostData.over_18
        };
        if (tradeThread.type == PostType.trade) {
          let buysAndSells = this.getAdditionalTradeInformation(actualPostData);
          tradeThread.partnerId = this.getTradeParterId(tradeThread.steamProfileURL);
          tradeThread.wants = buysAndSells.wants;
          tradeThread.has = buysAndSells.has;
          if (tradeThread.steamProfileURL == "unknown") {
            tradeThread.type = PostType.unknown;
          }
        }
        existingRedditPosts.push(tradeThread);
      });
    }
    return existingRedditPosts;
  }

  checkIfAnyObjectPropertyIsUndefined(objectToCheck) {
    let savedStateIsNotComplete: boolean = false;
    for (let property in objectToCheck) {
      if (objectToCheck[property] === "undefined") {
        savedStateIsNotComplete = true;
      }
    }
    return savedStateIsNotComplete;
  }

  private getPostType(threadTitle: string) {
    let postType: PostType;

    if (!threadTitle.match(/\[[A-Za-z]*]/g)) {
      return PostType.important;
    }
    let titlePrefix = threadTitle.match(/\[[A-Za-z]*]/g)[0].toLowerCase();
    switch (titlePrefix) {
      case "[h]":
        postType = PostType.trade;
        break;
      case "[discussion]":
        postType = PostType.discussion;
        break;
      case "[store]":
        postType = PostType.store;
        break;
      case "[pc]":
      case "[pricecheck]":
        postType = PostType.pricecheck;
        break;
      case "[question]":
      case "[q]":
        postType = PostType.question;
        break;
      case "[psa]":
        postType = PostType.psa;
        break;
      case "[free]":
        postType = PostType.free;
        break;
      case "[lph]":
        postType = PostType.lph;
        break;
      default:
        postType = PostType.unknown;
    }
    return postType;
  }

  private getTradeParterId(partnerProfileURL: string) {
    return partnerProfileURL.replace("https://steamcommunity.com/profiles/", "");
  }

  private getTradeUrl(threadContent: string) {
    let tradeOfferBaseURL = "https://steamcommunity.com/tradeoffer/new/?";
    if (!(threadContent.match(/partner=[0-9]*/g) && threadContent.match(/(token=[-0-9a-zA-Z_]*)/g))) {
      return "";
    }
    let tradePartner: string = threadContent.match(/partner=[0-9]*/g)[0];
    let tradeToken: string = threadContent.match(/(token=[-0-9a-zA-Z_]*)/g)[0];
    return tradeOfferBaseURL + tradePartner + "&" + tradeToken;
  }

  private getAdditionalTradeInformation(redditPost: any) {
    let postTitle: string = redditPost.title;
    let wantsIndex: number = postTitle.toUpperCase().indexOf("[W]");
    return {
      has: postTitle.substring(3, wantsIndex).trim(),
      wants: postTitle.substr(wantsIndex + 3, postTitle.length).trim()
    }
  }

  private timeSince(createdAt: number) {
    let currentDate: Date = new Date();
    let seconds = Math.floor((currentDate.getTime() / 1000 - createdAt));

    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + "m";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + " s";
  }

  private getSteamProfileURL(authorFlairText: string) {
    if (authorFlairText) {
      let startOfProfileURL = authorFlairText.indexOf("https://steamcommunity.com");
      if (startOfProfileURL < 0)
        return "unknown";
      return authorFlairText.substr(startOfProfileURL, authorFlairText.length);
    } else {
      return "unknown";
    }
  }
}
