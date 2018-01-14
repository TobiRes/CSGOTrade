import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  isLoading: boolean = true;


  private myItemsToTrade: CSGOItem[] = []
  private theirItemsToTrade: CSGOItem[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private steamService: SteamService,
              private itemService: ItemService,
              private alertCtrl: AlertController) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.loadTheirInventory();
  }

  addItemToTrade(csgoItem) {
    this.theirItemsToTrade.push(csgoItem);
  }

  continueToTradeReview() {
    this.navCtrl.push("trade-review", {
      myItemsToTrade: this.myItemsToTrade,
      theirItemsToTrade: this.theirItemsToTrade,
      redditPost: this.redditPost
    })
  }

  private loadTheirInventory() {
    this.isLoading = true;
    this.steamService.getCSGOInventory(this.redditPost.steamProfileURL)
      .then((csgoInventory: any) => {
        let csgoItemData = csgoInventory.rgDescriptions;
        Object.keys(csgoItemData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(csgoItemData[key]));
        });
        this.itemService.addAssetIds(this.csgoItems, csgoInventory.rgInventory);
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.alertLoadInventoryError(error);
      });
  }

  private alertLoadInventoryError(error: any) {
    this.alertCtrl.create({
      title: "Error loading their inventory!",
      subTitle: "This might be caused by loading too many inventories in a short time, please try again later.",
      buttons: ['Dismiss']
    }).present();
  }
}
