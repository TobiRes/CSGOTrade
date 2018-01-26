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
  tradeAbleKeys: CSGOKey[] = [];

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

  addKeysToTrade(csgoKeysAndType){
    //Splitting in to two function for performance reasons
    for(let i = this.theirItemsToTrade.length -1; i >= 0; i--){
      if(this.theirItemsToTrade[i].fullName == csgoKeysAndType.currentKeyType){
        this.theirItemsToTrade.splice(i, 1);
      }
    }
    this.theirItemsToTrade = this.theirItemsToTrade.concat(csgoKeysAndType.selectedKeys);
  }

  getSelectedKeysOfCertainType(csgoKey: CSGOItem){
    let count: number = 0;
    this.theirItemsToTrade.forEach( (item: CSGOItem) => {
      if(item.fullName == csgoKey.fullName){
        count++;
      }
    });
    return count;
  }

  isKeySelected(keys: CSGOKey){
    let selected = false;
    this.theirItemsToTrade.forEach(theirItem => {
      if (theirItem.fullName == keys.keys[0].fullName) {
        selected = true;
      }
    });
    return selected;
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
    console.log(this.theirItemsToTrade);
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
        this.getKeysAndItemsSeperatly();
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

  private getKeysAndItemsSeperatly() {
    let splitItems = this.itemService.splitIntoItemsAndKeys(this.tradeableItems);
    this.tradeableItems = splitItems.csgoItems;
    this.tradeAbleKeys = splitItems.keys;
  }
}
