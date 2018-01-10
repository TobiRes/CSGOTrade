import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Tradeoffer} from "../models/tradeoffer.model";

@Injectable()
export class TradeofferService {
  constructor(private http: HttpClient, private storage: Storage){

  }

  sendTradeOffer(){
    let tradeOffer: Tradeoffer = this.getTradeOffer();
    let tradeofferBody = this.getTradeOfferBody(tradeOffer);
    this.getTradeOfferHeader(tradeOffer)
      .then(httpHeader =>{
        console.log("offer, body, header", tradeOffer, tradeofferBody, httpHeader);
        let options = {
          headers: httpHeader,
          withCredentials: true
        };
        this.http.post("https://steamcommunity.com/tradeoffer/new/send", tradeofferBody, options)
          .subscribe( response => {
            console.log(response);
          })
      })
      .catch( error => console.error(error));
  }

  private getTradeOfferBody(tradeofferData: Tradeoffer) {
    let postBody = new FormData();
    postBody.append("sessionid", tradeofferData.sessionId);
    postBody.append("serverid", "1");
    postBody.append("partner", tradeofferData.partnerId);
    postBody.append("json_tradeoffer", tradeofferData.content.toString());
    postBody.append("trade_offer_create_params", tradeofferData.accessToken.toString());

    return postBody;
  }

  private getTradeOfferHeader(tradeofferData: Tradeoffer) {
    return new Promise((resolve, reject) => {
        this.getSteamLoginSecureCookie(tradeofferData)
          .then( (steamLoginSecureCookie: string) => {
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
    return new Promise((resolve, reject) =>{
      this.storage.get("steamLoginData")
        .then( (steamLoginData: any) => {
          console.log("steamLoginData", steamLoginData);
          if(steamLoginData){
            let steamLoginSecureCookie = steamLoginData.transfer_parameters.steamid + "||"
              + steamLoginData.transfer_parameters.token_secure + ";"
              + tradeofferData.sessionId;
            resolve(steamLoginSecureCookie);
          }
        })
        .catch(error => console.error(error));
    });
  }


  private getTradeOffer() {
    return {
      sessionId: "",
      partnerId: "76561198092556240",
      content: {"newversion":true,"version":3,"me":{"assets":[{"appid":730,"contextid":"2","amount":1,"assetid":"13285612688"}],"currency":[],"ready":false},"them":{"assets":[{"appid":730,"contextid":"2","amount":1,"assetid":"12885033159"}],"currency":[],"ready":false}},
      accessToken: {"trade_offer_access_token":"925lf5U-"},
      tradeURL: "https://steamcommunity.com/tradeoffer/new/?partner=132290512&token=925lf5U-"
    }
  }
}
