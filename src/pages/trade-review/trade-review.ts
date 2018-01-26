import {Component} from '@angular/core';
import {AlertController, IonicPage, NavParams} from 'ionic-angular';
import {CSGOItem} from "../../models/csgoItem.model";
import {RedditPost} from "../../models/redditpost.model";
import {TradeofferService} from "../../services/tradeoffer.service";
import {DynamicStyleService} from "../../services/dynamic-style.service";
import {CSGOKey} from "../../models/csgoKey.model";
import {CSGOItemService} from "../../services/csgoItem.service";

@IonicPage()
@Component({
  selector: 'page-trade-review',
  templateUrl: 'trade-review.html',
})
export class TradeReviewPage {

  redditPost: RedditPost;

  myItemsToTrade: CSGOItem[] = [];
  myKeys: CSGOKey[] = [];

  theirItemsToTrade: CSGOItem[] = [];
  theirKeys: CSGOKey[] = [];

  constructor(public navParams: NavParams,
              private tradeOfferService: TradeofferService,
              private dynStyleService: DynamicStyleService,
              private alertCtrl: AlertController,
              private itemService: CSGOItemService) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");
    this.getKeysAndItemsSeperatly();
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

  private getKeysAndItemsSeperatly() {
    let mySplitItems = this.itemService.splitIntoItemsAndKeys(this.myItemsToTrade);
    this.myItemsToTrade = mySplitItems.csgoItems;
    this.myKeys = mySplitItems.keys;
    let theirSplitItems = this.itemService.splitIntoItemsAndKeys(this.theirItemsToTrade);
    this.theirItemsToTrade = theirSplitItems.csgoItems;
    this.theirKeys = theirSplitItems.keys;
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
