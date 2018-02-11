import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {RedditPost} from "../../models/redditpost.model";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {SteamService} from "../../services/steam.service";

@IonicPage()
@Component({
  selector: 'page-trade-link',
  templateUrl: 'trade-link.html',
})
export class TradeLinkPage {

  steamTradelink: string;
  steamProfileURL: string;

  constructor(public navCtrl: NavController,
              private steamService: SteamService,
              private alertCtrl: AlertController) {
  }


  sendTradeOffer() {
    let postData: RedditPost = {
      steamProfileURL: this.steamProfileURL,
      tradelink: this.steamTradelink
    }
    this.navCtrl.push(TradeTheirItemsPage, {postData});
  }

  private validateInput(): Promise<any>{
    return new Promise<boolean>(((resolve, reject) =>  {
      this.steamService.validateSteamURL(this.steamProfileURL)
        .then((profileUrl: string) => {
          this.steamProfileURL = profileUrl;
          this.validateTradelink() ? resolve() : reject();
        })
        .catch( err => {
          console.error(err);
          reject();
        });
    }));
  }

  private validateTradelink(): boolean {
    let tradelink = this.steamService.validateTradelink(this.steamTradelink);
    if(tradelink == "false"){
      this.steamTradelink = "";
      this.alertWrongTradelink();
      return false;
    } else {
      this.steamTradelink = tradelink;
      return true;
    }
  }

  private alertWrongTradelink() {
    this.alertCtrl.create({
      title: "Wrong Tradelink",
      subTitle: "Please enter a correct Tradelink!",
      buttons: ['Dismiss']
    }).present();
  }
}
