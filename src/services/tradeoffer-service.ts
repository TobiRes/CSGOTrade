import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Tradeoffer} from "../models/tradeoffer.model";
import {CSGOItem} from "../models/item.model";
import {RedditPost} from "../models/redditpost.model";
import {CookieService} from "angular2-cookie/core";
import {SteamLogin} from "../models/steamlogin.model";

@Injectable()
export class TradeofferService {
  constructor(private http: HttpClient, private storage: Storage, private cookieService: CookieService) {

  }

  sendTradeOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], redditPost: RedditPost) {
    let tradeOffer: Tradeoffer = this.getTradeOffer(myItemsToTrade,theirItemsToTrade,redditPost);
    let tradeofferBody = this.getTradeOfferBody(tradeOffer);
    this.getTradeOfferHeaderOptions(tradeOffer)
      .then(httpHeaderOptions => {

        console.log("DocumentCooki", document.cookie);
        console.log("CookieService", this.cookieService.getAll());
        console.log("Offerbody", tradeofferBody);
        console.log("OfferHeader", httpHeaderOptions);

        this.http.post("https://steamcommunity.com/tradeoffer/new/send", tradeofferBody, httpHeaderOptions)
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
    postBody.append("trade_offer_create_params", this.setTradeOfferCreateParams(tradeofferData));
    return postBody;
  }

  private getTradeOfferHeaderOptions(tradeofferData: Tradeoffer) {
    return new Promise((resolve, reject) => {
      this.getSteamLoginSecureCookie(tradeofferData)
        .then((steamLoginSecureCookie: string) => {
          let options = {
            headers: new HttpHeaders({
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Credentials": "true",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "Cookie": steamLoginSecureCookie,
              "Referer": tradeofferData.tradeURL
            }),
            withCredentials: true};

          resolve(options);
        })
        .catch(error => reject(error));
    })
  }

  private getSteamLoginSecureCookie(tradeofferData: Tradeoffer) {
    return new Promise((resolve, reject) => {
      this.storage.get("steamLoginData")
        .then((steamLoginData: SteamLogin) => {
          if (steamLoginData) {
            this.setDocumentCookies(steamLoginData, tradeofferData.sessionId);
            let steamLoginSecureCookie = this.buildSteamLoginCookie(steamLoginData, tradeofferData.sessionId);
            resolve(steamLoginSecureCookie);
          }
        })
        .catch(error => console.error(error));
    });
  }

  private getTradeOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], redditPost: RedditPost) {
    return {
      sessionId: this.generateSessionID(),
      partnerId: redditPost.partnerId,
      content: this.buildTradeOfferContent(myItemsToTrade, theirItemsToTrade),
      tradeURL: redditPost.tradelink,
      accessToken: this.getTradeOfferAccessToken(redditPost.tradelink)
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

  private buildSteamLoginCookie(steamLoginData: SteamLogin, sessionId: string){
    return "sessionid=" + sessionId + ";"
    + "steamLoginSecure=" + steamLoginData.steamId + "%7C%7C"
    + steamLoginData.steamLoginSecure + ";"
    + "steamLogin=" + steamLoginData.steamId + "%7C%7C" + steamLoginData.steamLogin + ";"
    + "steamMachineAuth" + steamLoginData.steamId + "=" + steamLoginData.steamMachineAuth + ";"
  }

  private setDocumentCookies(steamLoginData: SteamLogin, sessionId: string) {
    document.cookie = "sessionid=" + sessionId;
    document.cookie = "steamLoginSecure=" + steamLoginData.steamId + "%7C%7C"
      + steamLoginData.steamLoginSecure;
    document.cookie = "steamLogin=" + steamLoginData.steamId + "%7C%7C" + steamLoginData.steamLogin;
    document.cookie = "steamMachineAuth" + steamLoginData.steamId + "=" + steamLoginData.steamMachineAuth;
  }

  private setTradeOfferCreateParams(tradeofferData: Tradeoffer) {
    return JSON.stringify({"trade_offer_access_token": tradeofferData.accessToken.toString()});
  }

  private getTradeOfferAccessToken(tradelink: string) {
    let indexOfAccesTokenInTradeLink = tradelink.indexOf("token=");
    let accesToken = tradelink.substr(indexOfAccesTokenInTradeLink, tradelink.length).replace("token=", "")
    return accesToken;
  }
}
