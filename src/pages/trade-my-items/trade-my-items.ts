import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {ItemService} from "../../services/item.service";
import {CSGOItem} from "../../models/item.model";
import {Storage} from "@ionic/storage";
import {RedditPost} from "../../models/redditpost.model";


@IonicPage({
  name: "trade-my-items",
  segment: "trade-my-items",
  defaultHistory: ["home"]
})
@Component({
  selector: 'page-trade-my-items',
  templateUrl: 'trade-my-items.html',
})
export class TradeMyItemsPage {

  redditPost: RedditPost;
  csgoItems: CSGOItem[] = [];

  private mySteamProfile: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private steamService: SteamService,
              private loadCtrl: LoadingController,
              private itemService: ItemService,
              private alertCtrl: AlertController) {
    this.redditPost = this.navParams.get("postData");

    Promise.all([this.storage.get("csgoItems"), this.storage.get("steamProfileURL")])
      .then(storageData => {
        this.csgoItems = storageData[0];
        this.mySteamProfile = storageData[1];
        if (!this.csgoItems && this.mySteamProfile) {
          this.loadMyCsgoInventory();
        } else {
          this.alertEnterSteamProfile();
        }
      })
      .catch(error => console.error(error));
  }

  private loadMyCsgoInventory() {
    let loader = this.loadCtrl.create();
    loader.present();
    this.steamService.getCSGOInventory(this.mySteamProfile)
      .then(csgoInventory => {
        Object.keys(csgoInventory).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(csgoInventory[key]));
        });
        this.storage.set("csgoItems", this.csgoItems);
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
