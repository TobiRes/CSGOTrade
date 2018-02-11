import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController} from 'ionic-angular';
import {RedditPost} from "../../models/redditpost.model";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";
import {SteamService} from "../../services/steam.service";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-trade-link',
  templateUrl: 'trade-link.html',
})
export class TradeLinkPage {

  steamTradelink: string = "";
  steamProfileURL: string = "";
  recentTrades: RedditPost[] = [];
  recentTrade: RedditPost;

  constructor(public navCtrl: NavController,
              private steamService: SteamService,
              private alertCtrl: AlertController,
              private loadCtrl: LoadingController,
              private storage: Storage) {
  }

  ionViewWillEnter(){
    this.storage.get("recentTrades")
      .then((recentTrades: RedditPost[]) => {
        if(recentTrades){
          this.recentTrades = recentTrades;
          this.steamProfileURL = this.recentTrades[0].steamProfileURL;
          this.steamTradelink = this.recentTrades[0].tradelink;
        }
      })
  }

  sendTradeOffer() {
    let loading = this.loadCtrl.create();
    loading.present()
      .then( () => this.validateInput())
      .then( () => this.steamService.getNameOfSteamProfile(this.steamProfileURL))
      .then((profileName: string) => {
        let postData: RedditPost = {
          author: profileName,
          steamProfileURL: this.steamProfileURL,
          tradelink: this.steamTradelink
        }
        this.addTradeInfoToRecentTrades(postData);
        loading.dismissAll();
        this.navCtrl.push(TradeTheirItemsPage, {postData});
      }).catch( err => {
        loading.dismissAll();
        this.alertSomethingWentWrong();
        console.error(err);
    })
  }

  private validateInput(): Promise<any>{
    this.steamProfileURL = this.steamProfileURL.trim();
    this.steamTradelink = this.steamTradelink.trim();
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

  private addTradeInfoToRecentTrades(postData: RedditPost) {
    for(let i = this.recentTrades.length - 1; i >= 0; i--){
      if(this.recentTrades[i].tradelink == postData.tradelink){
        this.recentTrades.splice(i, 1);
      }
    }
    if(this.recentTrades.length > 7){
      this.recentTrades.splice(this.recentTrades.length - 1, 1);
    }
    this.recentTrades.push(postData);
    this.storage.set("recentTrades", this.recentTrades);
  }

  selectRecentTrade() {
    for(let i = this.recentTrades.length - 1; i >= 0; i--){
      if(this.recentTrades[i].tradelink == this.recentTrade.tradelink){
        this.steamProfileURL = this.recentTrade.steamProfileURL;
        this.steamTradelink = this.recentTrade.tradelink;
      }
    }
  }

  tradeOfferIsDisabled() {
    return this.steamProfileURL.length < 3 || this.steamTradelink.length < 5;
  }

  private alertSomethingWentWrong() {
    this.alertCtrl.create({
      title: "Something went wrong!",
      subTitle: "Please check your input.",
      buttons: ['Dismiss']
    }).present();
  }
}
