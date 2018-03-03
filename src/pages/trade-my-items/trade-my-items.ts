import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItemService} from "../../services/csgoItem.service";
import {CSGOItem} from "../../models/csgoItem.model";
import {Storage} from "@ionic/storage";
import {RedditPost} from "../../models/redditpost.model";
import {DynamicStyleService} from "../../services/dynamic-style.service";
import {TradeReviewPage} from "../trade-review/trade-review";
import {CSGOKey} from "../../models/csgoKey.model";


@IonicPage()
@Component({
  selector: 'page-trade-my-items',
  templateUrl: 'trade-my-items.html',
})
export class TradeMyItemsPage {

  redditPost: RedditPost;
  tradeableItems: CSGOItem[] = [];
  tradeableKeys: CSGOKey[] = [];
  backupTradeableItems: CSGOItem[] = [];
  selectedSkinTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedGrades: string[] = [];
  selectedExteriors: string[] = [];
  isLoading: boolean = true;

  private myItemsToTrade: CSGOItem[] = [];
  private theirItemsToTrade: CSGOItem[] = [];
  private csgoItems: CSGOItem[] = [];
  private mySteamProfile: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private steamService: SteamService,
              private itemService: CSGOItemService,
              private alertCtrl: AlertController,
              private dynStyleService: DynamicStyleService) {

    this.redditPost = this.navParams.get("redditPost");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");

    Promise.all([this.storage.get("csgoItems"), this.storage.get("steamProfileURL")])
      .then(storageData => {
        this.csgoItems = storageData[0];
        this.mySteamProfile = storageData[1];
        if (!this.csgoItems && this.mySteamProfile) {
          this.csgoItems = [];
          this.loadMyCsgoInventory();
        } else if (!this.mySteamProfile) {
          this.alertEnterSteamProfile();
        } else {
          this.isLoading = false;
          this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
          this.getKeysAndItemsSeperatly();
        }
      })
      .catch(error => console.error(error));
  }

  ionViewWillLeave() {
    this.storage.set("csgoItems", this.csgoItems);
    this.storage.set("steamProfileURL", this.mySteamProfile);
  }

  addItemToTrade(csgoItem) {
    let indexOfItem: number = this.myItemsToTrade.indexOf(csgoItem);
    if (indexOfItem > -1) {
      this.myItemsToTrade.splice(indexOfItem, 1);
    } else {
      this.myItemsToTrade.push(csgoItem);
    }
  }

  isSelected(item: CSGOItem) {
    let selected = false;
    this.myItemsToTrade.forEach(myItem => {
      if (myItem == item) {
        selected = true;
      }
    });
    return selected;
  }

  continueToTradeReview() {
    this.navCtrl.push(TradeReviewPage, {
      myItemsToTrade: this.myItemsToTrade,
      theirItemsToTrade: this.theirItemsToTrade,
      redditPost: this.redditPost
    })
  }

  addKeysToTrade(csgoKeysAndType) {
    //Splitting in to two function for performance reasons
    for (let i = this.theirItemsToTrade.length - 1; i >= 0; i--) {
      if (this.theirItemsToTrade[i].fullName == csgoKeysAndType.currentKeyType) {
        this.theirItemsToTrade.splice(i, 1);
      }
    }
    this.theirItemsToTrade = this.theirItemsToTrade.concat(csgoKeysAndType.selectedKeys);
  }

  getSelectedKeysOfCertainType(csgoKey: CSGOItem) {
    let count: number = 0;
    this.theirItemsToTrade.forEach((item: CSGOItem) => {
      if (item.fullName == csgoKey.fullName) {
        count++;
      }
    });
    return count;
  }

  isKeySelected(keys: CSGOKey) {
    let selected = false;
    this.theirItemsToTrade.forEach(theirItem => {
      if (theirItem.fullName == keys.keys[0].fullName) {
        selected = true;
      }
    });
    return selected;
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  applyFilter() {
    this.tradeableItems = this.backupTradeableItems;
    if (this.selectedSkinTypes.length) {
      this.filterItems("type", this.selectedSkinTypes);
    }
    if (this.selectedCategories.length) {
      let categories: string[] = this.itemService.mapSkinCategory(this.selectedCategories);
      this.filterItems("skinCategory", categories);
    }
    if (this.selectedGrades.length) {
      this.filterItems("grade", this.selectedGrades);
    }
    if (this.selectedExteriors.length) {
      let exteriors: string[] = this.itemService.mapExterior(this.selectedExteriors);
      this.filterItems("shortExterior", exteriors);
    }
  }

  private filterItems(propertyToCompare: any, selectedFilter: any[]) {
    let completeFilteredItemList: CSGOItem[] = [];
    selectedFilter.forEach((selectedFilter: any) => {
      completeFilteredItemList = completeFilteredItemList.concat(
        this.tradeableItems.filter(singleItem => {
          if (singleItem[propertyToCompare] == selectedFilter)
            return true;
          return false;
        })
      );
    });
    this.tradeableItems = completeFilteredItemList;
    this.tradeableItems = this.itemService.sortByKeyAndGrade(this.tradeableItems);
  }

  private loadMyCsgoInventory() {
    this.isLoading = true;
    this.steamService.getCSGOInventory(this.mySteamProfile)
      .then((csgoInventory: any) => {
        this.csgoItems = [];
        this.csgoItems = this.itemService.buildItemsAndFillWitData(csgoInventory, this.mySteamProfile);
        this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
        this.getKeysAndItemsSeperatly();
        this.isLoading = false;
      })
      .catch(error => {
        console.error(error)
        this.isLoading = false;
        if (this.wrongInvURL(error)) {
          this.mySteamProfile = "";
          this.alertWrongURL();
        } else {
          this.alertLoadInventoryError(error);
        }
      });
  }

  private wrongInvURL(error) {
    if (error)
      return error.status == 200 && error.name == "HttpErrorResponse" && error.ok == false && error.message.indexOf("Http failure during parsing for") > -1;
    else
      return true;
  }

  private getKeysAndItemsSeperatly() {
    let splitItems = this.itemService.splitIntoItemsAndKeys(this.tradeableItems);
    this.tradeableItems = splitItems.csgoItems;
    this.tradeableKeys = splitItems.keys;
    this.backupTradeableItems = this.tradeableItems;
  }

  private alertLoadInventoryError(error: any) {
    this.alertCtrl.create({
      title: "Error!",
      subTitle: "Loaded too many inventories in a short time - steam doesn't like that. Please try again later.",
      buttons: ['Dismiss']
    }).present();
  }

  private alertEnterSteamProfile() {
    this.alertCtrl.create({
      title: 'Please enter your Steamprofile!',
      subTitle: 'Enter your profile by either your custom URL or SteamID. You can always update or change it from the inventory tab.',
      inputs: [
        {
          name: "steamProfileURL",
          placeholder: 'Enter Profile...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.isLoading = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enter',
          handler: data => {
            if (data.steamProfileURL) {
              this.steamService.validateSteamURL(data.steamProfileURL)
                .then((steamProfileURL: string) => {
                  this.mySteamProfile = steamProfileURL;
                  this.loadMyCsgoInventory();
                })
            } else {
              console.log("Something went wrong.");
              return false;
            }
          }
        }
      ]
    }).present();
  }

  private alertWrongURL() {
    this.alertCtrl.create({
      title: 'Profile could not be found',
      subTitle: 'Please enter a valid profile, containing either your custom URL or you SteamID. You can always update or change it from the inventory tab.',
      inputs: [
        {
          name: "steamProfileURL",
          placeholder: 'Enter Profile...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.isLoading = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enter',
          handler: data => {
            if (data.steamProfileURL) {
              this.steamService.validateSteamURL(data.steamProfileURL)
                .then((steamProfileURL: string) => {
                  this.mySteamProfile = steamProfileURL;
                  this.loadMyCsgoInventory();
                })
            } else {
              console.log("Something went wrong.");
              return false;
            }
          }
        }
      ]
    }).present();
  }
}
