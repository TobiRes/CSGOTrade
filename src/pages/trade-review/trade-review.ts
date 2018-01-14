import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CSGOItem} from "../../models/item.model";
import {RedditPost} from "../../models/redditpost.model";
import {TradeofferService} from "../../services/tradeoffer.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@IonicPage({
  name: "trade-review",
  segment: "trade-review",
  defaultHistory: ["trade-their-items"]
})
@Component({
  selector: 'page-trade-review',
  templateUrl: 'trade-review.html',
})
export class TradeReviewPage {

  redditPost: RedditPost;
  csgoItems: CSGOItem[] = [];

  private myItemsToTrade: CSGOItem[] = []
  private theirItemsToTrade: CSGOItem[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private tradeOfferService: TradeofferService, private iab: InAppBrowser) {
    this.redditPost = this.navParams.get("redditPost");
    this.myItemsToTrade = this.navParams.get("myItemsToTrade");
    this.theirItemsToTrade = this.navParams.get("theirItemsToTrade");
  }

  sendTradeOffer(){
    const browser = this.iab.create('https://steamcommunity.com/tradeoffer/new/?partner=132290512&token=925lf5U-');
    // let script: string  = "var g_rgCurrentTradeStatus = {\"newversion\":true,\"version\":3,\"me\":{\"assets\":[{\"appid\":730,\"contextid\":\"2\",\"amount\":1,\"assetid\":\"13285612688\"}],\"currency\":[],\"ready\":false},\"them\":{\"assets\":[{\"appid\":730,\"contextid\":\"2\",\"amount\":1,\"assetid\":\"12885033159\"}],\"currency\":[],\"ready\":false}}; RefreshTradeStatus( g_rgCurrentTradeStatus );"

    let trade = JSON.stringify({"newversion":true,"version":3,"me":{"assets":[{"appid":730,"contextid":"2","amount":1,"assetid":"13285612688"}],"currency":[],"ready":false},"them":{"assets":[{"appid":730,"contextid":"2","amount":1,"assetid":"12885033159"}],"currency":[],"ready":false}});
    let script  = "(function() { alert(123); g_rgCurrentTradeStatus =" + trade +  ";})()"

    browser.on("loadstop").subscribe( () => {
      browser.executeScript({code : script});
    })
    //this.tradeOfferService.sendTradeOffer(this.myItemsToTrade, this.theirItemsToTrade, this.redditPost);
  }
}
