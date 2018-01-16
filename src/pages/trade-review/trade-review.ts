import {Component} from '@angular/core';
import {AlertController, IonicPage, NavParams} from 'ionic-angular';
import {CSGOItem} from "../../models/item.model";
import {RedditPost} from "../../models/redditpost.model";
import {TradeofferService} from "../../services/tradeoffer.service";
import {DynamicStyleService} from "../../services/dynamic-style.service";

@IonicPage({
  name: "trade-review",
  segment: "trade-review",
  defaultHistory: ["trade-my-items"]
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

  constructor(public navParams: NavParams,
              private tradeOfferService: TradeofferService,
              private dynStyleService: DynamicStyleService,
              private alertCtrl: AlertController) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");
  }

  sendTradeOffer() {
    if (!this.theirItemsToTrade.length) {
      this.alertUserHasNotSetAnyItemsForTradePartner();
    } else {
      this.tradeOfferService.sendTradeOffer(this.myItemsToTrade, this.theirItemsToTrade, this.redditPost);
    }
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private alertUserHasNotSetAnyItemsForTradePartner() {
    this.alertCtrl.create({
      title: 'You are about to create a empty Tradeoffer!',
      subTitle: "When you send this offer you will not get any items in return. Continue anyway?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continue',
          handler: () => {
            this.tradeOfferService.sendTradeOffer(this.myItemsToTrade, this.theirItemsToTrade, this.redditPost);
          }
        }
      ]
    }).present();
  }
}
