import {Component} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItemService} from "../../services/csgoItem.service";
import {CSGOItem} from "../../models/csgoItem.model";
import {Storage} from "@ionic/storage";
import {RedditPost} from "../../models/redditpost.model";
import {DynamicStyleService} from "../../services/dynamic-style.service";
import {TradeReviewPage} from "../trade-review/trade-review";


@IonicPage()
@Component({
  selector: 'page-trade-my-items',
  templateUrl: 'trade-my-items.html',
})
export class TradeMyItemsPage {

  redditPost: RedditPost;
  tradeableItems: CSGOItem[] = [];
  isLoading: boolean = true;

  private myItemsToTrade: CSGOItem[] = [];
  private theirItemsToTrade: CSGOItem[] = [];
  private csgoItems: CSGOItem[] = [];
  private mySteamProfile: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private steamService: SteamService,
              private loadCtrl: LoadingController,
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
        } else if(!this.mySteamProfile) {
          this.alertEnterSteamProfile();
        } else {
          this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
        }
      })
      .catch(error => console.error(error));
  }

  ionViewWillLeave(){
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

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private loadMyCsgoInventory() {
    this.isLoading = true;
    this.steamService.getCSGOInventory(this.redditPost.steamProfileURL)
      .then((csgoInventory: any) => {
        try {
          let csgoItemData = csgoInventory.rgDescriptions;
          Object.keys(csgoItemData).forEach(key => {
            this.csgoItems.push(this.itemService.fillItemMetaData(csgoItemData[key]));
          });
          this.csgoItems = this.itemService.addAssetIds(this.csgoItems, csgoInventory.rgInventory);
          this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
          this.isLoading = false;
        } catch (error){
          console.error(error)
        }
      })
      .catch(error => {
        console.error(error)
        this.isLoading = false;
        this.alertLoadInventoryError(error);
      });
  }

  private alertLoadInventoryError(error: any) {
    this.alertCtrl.create({
      title: "Error!",
      subTitle: "Something went wrong.",
      buttons: ['Dismiss']
    }).present();
  }

  private alertEnterSteamProfile() {
    this.alertCtrl.create({
      title: 'Please enter your Steamprofile URL',
      inputs: [
        {
          name: "steamProfileURL",
          placeholder: 'Enter URL...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enter',
          handler: data => {
            if (data.steamProfileURL) {
              this.mySteamProfile = data.steamProfileURL;
              this.loadMyCsgoInventory();
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
