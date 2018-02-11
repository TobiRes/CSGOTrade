import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RedditPost} from "../../models/redditpost.model";
import {TradeTheirItemsPage} from "../trade-their-items/trade-their-items";

@IonicPage()
@Component({
  selector: 'page-trade-link',
  templateUrl: 'trade-link.html',
})
export class TradeLinkPage {

  steamTradelink: string;
  steamProfileURL: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  sendTradeOffer() {
    let postData: RedditPost = {
      steamProfileURL: this.steamProfileURL,
      tradelink: this.steamTradelink
    }
    this.navCtrl.push(TradeTheirItemsPage, {postData});
  }

  private validateInput(): boolean{
    let valid: false;

    return valid;
  }

}
