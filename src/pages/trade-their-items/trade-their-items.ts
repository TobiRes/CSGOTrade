import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItem} from "../../models/csgoItem.model";
import {RedditPost} from "../../models/redditpost.model";
import {Storage} from "@ionic/storage";
import {CSGOItemService} from "../../services/csgoItem.service";
import {DynamicStyleService} from "../../services/dynamic-style.service";
import {TradeMyItemsPage} from "../trade-my-items/trade-my-items";
import {CSGOKey} from "../../models/csgoKey.model";

@IonicPage()
@Component({
  selector: 'page-trade-their-items',
  templateUrl: 'trade-their-items.html',
})
export class TradeTheirItemsPage {

  redditPost: RedditPost;
  isLoading: boolean = true;
  tradeableItems: CSGOItem[] = [];

  private csgoItems: CSGOItem[] = [];
  private theirItemsToTrade: CSGOItem[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private steamService: SteamService,
              private itemService: CSGOItemService,
              private alertCtrl: AlertController,
              private dynStyleService: DynamicStyleService) {
    this.redditPost = this.navParams.get("postData");
    this.loadTheirInventory();
  }

  addItemToTrade(csgoItem) {
    let indexOfItem: number = this.theirItemsToTrade.indexOf(csgoItem);
    if (indexOfItem > -1) {
      this.theirItemsToTrade.splice(indexOfItem, 1);
    } else {
      this.theirItemsToTrade.push(csgoItem);
    }
  }

  isSelected(item: CSGOItem) {
    let selected = false;
    this.theirItemsToTrade.forEach(theirItem => {
      if (theirItem == item) {
        selected = true;
      }
    });
    return selected;
  }

  continueSelectingMyItems() {
    this.navCtrl.push(TradeMyItemsPage, {
      theirItemsToTrade: this.theirItemsToTrade,
      redditPost: this.redditPost
    })
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private loadTheirInventory() {
    this.isLoading = true;
    this.steamService.getCSGOInventory(this.redditPost.steamProfileURL)
      .then((csgoInventory: any) => {
        let csgoItemData = csgoInventory.rgDescriptions;
          console.log(csgoInventory.rgDescriptions);
        Object.keys(csgoItemData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(csgoItemData[key]));
        });
        this.csgoItems = this.itemService.addAssetIdsAndAddAllMissingDuplicates(this.csgoItems, csgoInventory.rgInventory);
        this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
        this.tradeableItems = this.itemService.sortByKeyAndGrade(this.tradeableItems);
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
