import {Injectable} from "@angular/core";
import {PostType} from "../models/trade.model";

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

  getTradeUrl(threadContent: string) {
    let tradeOfferBaseURL = "https://steamcommunity.com/tradeoffer/new/?";
    if (!(threadContent.match(/partner=[0-9]*/g) && threadContent.match(/(token=[-0-9a-zA-Z_]*)/g))) {
      return "";
    }
    let tradePartner: string = threadContent.match(/partner=[0-9]*/g)[0];
    let tradeToken: string = threadContent.match(/(token=[-0-9a-zA-Z_]*)/g)[0];
    return tradeOfferBaseURL + tradePartner + "&amp;" + tradeToken;
  }

  getAdditionalTradeInformation(redditPost: any) {
    let postTitle: string = redditPost.data.title;
    let wantsIndex: number = postTitle.toUpperCase().indexOf("[W]");
    return {
      has: postTitle.substring(3, wantsIndex).trim(),
      wants: postTitle.substr(wantsIndex + 3 , postTitle.length).trim()
    }
  }
}
