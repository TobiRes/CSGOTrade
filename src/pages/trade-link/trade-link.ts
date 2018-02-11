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
    this.validateInput()
      .then( () => this.steamService.getNameOfSteamProfile(this.steamProfileURL))
      .then((profileName: string) => {
        let postData: RedditPost = {
          author: profileName,
          steamProfileURL: this.steamProfileURL,
          tradelink: this.steamTradelink
        }
        this.navCtrl.push(TradeTheirItemsPage, {postData});
      }).catch( err => {
        console.error(err);
    })
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
          this.alertWrongSteamProfile();
          this.steamProfileURL = "";
          reject();
        });
    }));
  }

  private validateTradelink(): boolean {
    let tradelink = this.steamService.validateTradelink(this.steamTradelink);
    if(tradelink == "false"){
      this.alertWrongTradelink();
      this.steamTradelink = "";
      return false;
    } else {
      this.steamTradelink = tradelink;
      return true;
    }
  }

  private alertWrongSteamProfile() {
    this.alertCtrl.create({
      title: "Wrong Steamprofile",
      subTitle: "Please enter a correct Steamprofile!",
      buttons: ['Dismiss']
    }).present();
  }

  private alertWrongTradelink() {
    this.alertCtrl.create({
      title: "Wrong Tradelink",
      subTitle: "Please enter a correct Tradelink!",
      buttons: ['Dismiss']
    }).present();
  }
}
