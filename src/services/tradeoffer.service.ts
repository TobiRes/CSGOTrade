import {Injectable} from "@angular/core";
import {CSGOItem} from "../models/csgoItem.model";

@Injectable()
export class TradeofferService {


  buildTradeScript(tradeOfferContent: string) {
    return "(function() { g_rgCurrentTradeStatus =" + tradeOfferContent + "; RefreshTradeStatus( g_rgCurrentTradeStatus );})()";
  }

  buildTradeOfferContent(myItems: CSGOItem[], theirItems: CSGOItem[]) {
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

  private buildAssets(csgoItems: CSGOItem[]) {
    let assets: any[] = [];
    csgoItems.forEach((csgoItem: CSGOItem) => {
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
