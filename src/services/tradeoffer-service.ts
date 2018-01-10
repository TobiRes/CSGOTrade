import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Tradeoffer} from "../models/tradeoffer.model";
import {CSGOItem} from "../models/item.model";

@Injectable()
export class TradeofferService {
  constructor(private http: HttpClient, private storage: Storage) {

  }

  sendTradeOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], tradeURL: any) {
    let tradeOffer: Tradeoffer = this.getTradeOffer(myItemsToTrade,theirItemsToTrade,tradeURL);
    let tradeofferBody = this.getTradeOfferBody(tradeOffer);
    this.getTradeOfferHeader(tradeOffer)
      .then(httpHeader => {
        console.log("offer", tradeOffer);
        console.log("json", JSON.stringify(tradeOffer.content));
        console.log("body", tradeofferBody);
        console.log("header", httpHeader);
        this.http.post("https://steamcommunity.com/tradeoffer/new/send", tradeofferBody, httpHeader)
          .subscribe(response => {
            console.log(response);
          })
      })
      .catch(error => console.error(error));
  }

  private getTradeOfferBody(tradeofferData: Tradeoffer) {
    let postBody = new FormData();
    postBody.append("sessionid", tradeofferData.sessionId);
    postBody.append("serverid", "1");
    postBody.append("partner", tradeofferData.partnerId);
    postBody.append("json_tradeoffer", JSON.stringify(tradeofferData.content));
    //postBody.append("trade_offer_create_params", tradeofferData.accessToken.toString());
    return postBody;
  }

  private getTradeOfferHeader(tradeofferData: Tradeoffer) {
    return new Promise((resolve, reject) => {
      this.getSteamLoginSecureCookie(tradeofferData)
        .then((steamLoginSecureCookie: string) => {
          let httpHeader = new HttpHeaders()
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "*")
            .set("Access-Control-Allow-Credentials", "true")
            .set("Cookie", steamLoginSecureCookie)
            .set("Referer", tradeofferData.tradeURL);
          resolve(httpHeader);
        })
        .catch(error => reject(error));
    })
  }

  private getSteamLoginSecureCookie(tradeofferData: Tradeoffer) {
    return new Promise((resolve, reject) => {
      this.storage.get("steamLoginData")
        .then((steamLoginData: any) => {
          console.log("steamLoginData", steamLoginData);
          if (steamLoginData) {
            let steamLoginSecureCookie = "steamLoginSecure=" + steamLoginData.transfer_parameters.steamid + "%7C%7C"
              + steamLoginData.transfer_parameters.token_secure + ";sessionid="
              + tradeofferData.sessionId + ";";
            resolve(steamLoginSecureCookie);
          }
        })
        .catch(error => console.error(error));
    });
  }


  private getTradeOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], tradeURL: any) {
    return {
      sessionId: this.generateSessionID(),
      partnerId: "76561198092556240",
      content: this.buildTradeOfferContent(myItemsToTrade, theirItemsToTrade),
      //accessToken: {"trade_offer_access_token": "925lf5U-"},
      tradeURL: tradeURL
    }
  }

  private buildTradeOfferContent(myItems: CSGOItem[], theirItems: CSGOItem[]){
    return {
      "newversion": true,
      "version": 3,
      "me": {
        "assets": this.buildAssets(myItems),
        "currency": [],
        "ready": false
      },
      "them": {
        "assets": this.buildAssets(theirItems),
        "currency": [],
        "ready": false
      }
    }
  }

  private generateSessionID() {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionid = '';
    for (let i = 0; i < 10; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      sessionid += charSet.substring(randomPoz, randomPoz + 1);
    }
    return sessionid;
  }

  private buildAssets(csgoItems: CSGOItem[]) {
    let assets: any[] = [];
    csgoItems.forEach( (csgoItem: CSGOItem) => {
      let singleAsset = {
        "appid": 730,
        "contextid": "2",
        "amount": 1,
        "assetid": csgoItem.assetId
      }
      assets.push(singleAsset);
    });
    return assets;
  }
}
