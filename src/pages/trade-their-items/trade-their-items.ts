import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItem} from "../../models/item.model";
import {RedditPost} from "../../models/redditpost.model";
import {Storage} from "@ionic/storage";
import {ItemService} from "../../services/item.service";

@IonicPage({
  name: "trade-their-items",
  segment: "trade-their-items",
  defaultHistory: ["trade-my-items"]
})
@Component({
  selector: 'page-trade-their-items',
  templateUrl: 'trade-their-items.html',
})
export class TradeTheirItemsPage {
  redditPost: RedditPost;
  csgoItems: CSGOItem[] = [];

  private myItemsToTrade: CSGOItem[] = []
  private theirItemsToTrade: CSGOItem[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private steamService: SteamService,
              private loadCtrl: LoadingController,
              private itemService: ItemService,
              private alertCtrl: AlertController) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.loadTheirInventory();
  }

  addItemToTrade(csgoItem){
    this.theirItemsToTrade.push(csgoItem);
  }

  continueToTradeReview(){
    console.log("my", this.myItemsToTrade);
    console.log("their", this.theirItemsToTrade)
    this.navCtrl.push("trade-review", {myItemsToTrade: this.myItemsToTrade, theirItemsToTrade: this.theirItemsToTrade, redditPost: this.redditPost})
  }

  private loadTheirInventory() {
    let loader = this.loadCtrl.create();
    loader.present();
    this.steamService.getCSGOInventory(this.redditPost.steamProfileURL)
      .then((csgoInventory: any) => {
        let csgoItemData = csgoInventory.rgDescriptions;
        Object.keys(csgoItemData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(csgoItemData[key]));
        });
        this.itemService.addAssetIds(this.csgoItems, csgoInventory.rgInventory)
        loader.dismissAll();
      })
      .catch(error => {
        loader.dismissAll();
        this.alertLoadInventoryError(error);
      });
  }

  private alertLoadInventoryError(error: any) {
    this.alertCtrl.create({
      title: "Error!",
      subTitle: error.message,
      buttons: ['Dismiss']
    }).present();
  }
}
