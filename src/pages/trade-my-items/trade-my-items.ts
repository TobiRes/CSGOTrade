import {Component} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, Modal, ModalController, ModalOptions, NavController,
  NavParams
} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItemService} from "../../services/csgoItem.service";
import {CSGOItem} from "../../models/csgoItem.model";
import {Storage} from "@ionic/storage";
import {RedditPost} from "../../models/redditpost.model";
import {DynamicStyleService} from "../../services/dynamic-style.service";


@IonicPage({
  name: "trade-my-items",
  segment: "trade-my-items",
  defaultHistory: ["trade-their-items"]
})
@Component({
  selector: 'page-trade-my-items',
  templateUrl: 'trade-my-items.html',
})
export class TradeMyItemsPage {

  redditPost: RedditPost;
  tradeableItems: CSGOItem[] = [];

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
              private modal: ModalController,
              private dynStyleService: DynamicStyleService) {

    this.redditPost = this.navParams.get("redditPost");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");

    Promise.all([this.storage.get("csgoItems"), this.storage.get("steamProfileURL")])
      .then(storageData => {
        this.csgoItems = storageData[0];
        this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
        this.mySteamProfile = storageData[1];
        console.log(this.csgoItems);
        if (!this.csgoItems && this.mySteamProfile) {
          this.loadMyCsgoInventory();
        } else {
          this.alertEnterSteamProfile();
        }
      })
      .catch(error => console.error(error));
  }

  addItemToTrade(csgoItem) {
    let indexOfItem: number = this.myItemsToTrade.indexOf(csgoItem);
    if (indexOfItem > -1) {
      this.myItemsToTrade.splice(indexOfItem, 1);
    } else {
      this.myItemsToTrade.push(csgoItem);
    }
  }

  openModal(csgoItem: CSGOItem){
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("ItemModalPage", {csgoItem: csgoItem}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onWillDismiss((data)=> {

    });
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
    this.navCtrl.push("trade-review", {
      myItemsToTrade: this.myItemsToTrade,
      theirItemsToTrade: this.theirItemsToTrade,
      redditPost: this.redditPost
    })
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private loadMyCsgoInventory() {
    let loader = this.loadCtrl.create();
    loader.present();
    this.steamService.getCSGOInventory(this.mySteamProfile)
      .then((csgoInventory: any) => {
        let csgoItemData = csgoInventory.rgDescriptions;
        Object.keys(csgoItemData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(csgoItemData[key]));
        });
        this.csgoItems = this.itemService.addAssetIds(this.csgoItems, csgoInventory.rgInventory);
        this.tradeableItems = this.itemService.getTradeableItems(this.csgoItems);
        this.storage.set("csgoItems", this.csgoItems);
        this.storage.set("steamProfileURL", this.mySteamProfile);
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

  private alertEnterSteamProfile() {
    return this.alertCtrl.create({
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
    });
  }
}
