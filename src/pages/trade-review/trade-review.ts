import {Component} from '@angular/core';
import {AlertController, IonicPage, NavParams} from 'ionic-angular';
import {CSGOItem} from "../../models/csgoItem.model";
import {RedditPost} from "../../models/redditpost.model";
import {TradeofferService} from "../../services/tradeoffer.service";
import {DynamicStyleService} from "../../services/dynamic-style.service";
import {CSGOKey} from "../../models/csgoKey.model";
import {CSGOItemService} from "../../services/csgoItem.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";

@IonicPage()
@Component({
  selector: 'page-trade-review',
  templateUrl: 'trade-review.html',
})
export class TradeReviewPage {

  redditPost: RedditPost;
  buttonIsDisabled: boolean = true;

  myItemsToTrade: CSGOItem[] = [];
  myKeys: CSGOKey[] = [];

  theirItemsToTrade: CSGOItem[] = [];
  theirKeys: CSGOKey[] = [];


  private backupTheirItems: CSGOItem[] = [];
  private backupMyItems: CSGOItem[] = [];
  private destroyed$ = new Subject<void>();

  constructor(public navParams: NavParams,
              private tradeOfferService: TradeofferService,
              private dynStyleService: DynamicStyleService,
              private alertCtrl: AlertController,
              private itemService: CSGOItemService,
              private inAppBrowser: InAppBrowser) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");
    this.backupMyItems = this.myItemsToTrade;
    this.backupTheirItems = this.theirItemsToTrade;
    if (this.myItemsToTrade.length || this.theirItemsToTrade.length) {
      this.buttonIsDisabled = false;
    }
    this.getKeysAndItemsSeperatly();
  }

  sendTradeOffer() {
    if (!this.theirItemsToTrade.length && !this.theirKeys.length) {
      this.alertUserHasNotSetAnyItemsForTradePartner();
    } else {
      this.sendOffer(this.backupMyItems, this.backupTheirItems, this.redditPost);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private sendOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], redditPost: RedditPost) {
    let tradeOfferContent = JSON.stringify(this.tradeOfferService.buildTradeOfferContent(myItemsToTrade, theirItemsToTrade));
    let tradeScript = this.tradeOfferService.buildTradeScript(tradeOfferContent);
    const options: InAppBrowserOptions = {
      shouldPauseOnSuspend: "yes"
    };
    const browser = this.inAppBrowser.create(redditPost.tradelink, "_blank", options);
    try {
      browser.on("loadstop")
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          browser.executeScript({code: tradeScript});
        })
    } catch (e) {
      console.error(e)
    }
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
            this.sendOffer(this.myItemsToTrade, this.theirItemsToTrade, this.redditPost);
          }
        }
      ]
    }).present();
  }
}
