import {Injectable} from "@angular/core";
import {PostType, RedditPost} from "../models/redditpost.model";

@Injectable()
export class ThreadinfoService {

  constructor() {
  }

  getPostType(threadTitle: string) {
    let postType: PostType;

    if (!threadTitle.match(/\[[A-Za-z]*\]/g)) {
      return PostType.important;
    }
    let titlePrefix = threadTitle.match(/\[[A-Za-z]*\]/g)[0].toLowerCase();
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
        ;
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

  getTradeParterId(partnerProfileURL: string) {
    let partnerProfileId = partnerProfileURL.replace("https://steamcommunity.com/profiles/", "");
    return partnerProfileId;
  }

  getTradeUrl(threadContent: string) {
    let tradeOfferBaseURL = "https://steamcommunity.com/tradeoffer/new/?";
    if (!(threadContent.match(/partner=[0-9]*/g) && threadContent.match(/(token=[-0-9a-zA-Z_]*)/g))) {
      return "";
    }
    let tradePartner: string = threadContent.match(/partner=[0-9]*/g)[0];
    let tradeToken: string = threadContent.match(/(token=[-0-9a-zA-Z_]*)/g)[0];
    return tradeOfferBaseURL + tradePartner + "&" + tradeToken;
  }

  getAdditionalTradeInformation(redditPost: any) {
    let postTitle: string = redditPost.data.title;
    let wantsIndex: number = postTitle.toUpperCase().indexOf("[W]");
    return {
      has: postTitle.substring(3, wantsIndex).trim(),
      wants: postTitle.substr(wantsIndex + 3, postTitle.length).trim()
    }
  }

  timeSince(createdAt: number) {
    let currentDate: Date = new Date();
    let seconds = Math.floor((currentDate.getTime() / 1000 - createdAt));

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  getTradeInfo(existingRedditPosts: RedditPost[], redditPostData: any) {
    redditPostData.forEach(redditPost => {
      let tradeThread: RedditPost = {
        title: redditPost.data.title,
        author: redditPost.data.author,
        redditURL: redditPost.data.url,
        numberOfComments: redditPost.data.num_comments,
        timeSinceCreation: this.timeSince(redditPost.data.created_utc),
        content: redditPost.data.selftext,
        type: this.getPostType(redditPost.data.title),
        tradelink: this.getTradeUrl(redditPost.data.selftext),
        steamProfileURL: this.getSteamProfileURL(redditPost.data.author_flair_text),
      };
      if (tradeThread.type == PostType.trade) {
        let buysAndSells = this.getAdditionalTradeInformation(redditPost);
        tradeThread.partnerId = this.getTradeParterId(tradeThread.steamProfileURL)
        tradeThread.wants = buysAndSells.wants;
        tradeThread.has = buysAndSells.has;
      }
      existingRedditPosts.push(tradeThread);
    });
    return existingRedditPosts;
  }

  getSteamProfileURL(authorFlairText: string) {
    let startOfProfileURL = authorFlairText.indexOf("https://steamcommunity.com");
    if (startOfProfileURL < 0)
      return "unknown";
    return authorFlairText.substr(startOfProfileURL, authorFlairText.length);
  }
}
