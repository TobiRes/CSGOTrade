import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {CSGOItem} from "../../models/item.model";
import {RedditPost} from "../../models/redditpost.model";
import {TradeofferService} from "../../services/tradeoffer-service";

@IonicPage({
  name: "trade-review",
  segment: "trade-review",
  defaultHistory: ["trade-their-items"]
})
@Component({
  selector: 'page-trade-review',
  templateUrl: 'trade-review.html',
})
export class TradeReviewPage {

  redditPost: RedditPost;
  csgoItems: CSGOItem[] = [];

  private myItemsToTrade: CSGOItem[] = []
  private theirItemsToTrade: CSGOItem[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private tradeOfferService: TradeofferService) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");
  }

  sendTradeOffer(){
    this.tradeOfferService.sendTradeOffer(this.myItemsToTrade, this.theirItemsToTrade, this.redditPost);
  }
}
