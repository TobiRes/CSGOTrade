import {Injectable, OnDestroy} from "@angular/core";
import {CSGOItem} from "../models/item.model";
import {RedditPost} from "../models/redditpost.model";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Subject} from "rxjs/Subject";
import {takeUntil} from "rxjs/operators";

@Injectable()
export class TradeofferService implements OnDestroy {

  destroyed$ = new Subject<void>();

  constructor(private inAppBrowser: InAppBrowser) {
  }

  sendTradeOffer(myItemsToTrade: CSGOItem[], theirItemsToTrade: CSGOItem[], redditPost: RedditPost) {
    let tradeOfferContent = JSON.stringify(this.buildTradeOfferContent(myItemsToTrade, theirItemsToTrade));
    const browser = this.inAppBrowser.create(redditPost.tradelink);
    let tradeScript = this.buildTradeScript(tradeOfferContent);

    try {
      browser.on("loadstop")
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          browser.executeScript({code: tradeScript});
        })
    } catch (e) {
      console.error(e)
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private buildTradeScript(tradeOfferContent: string) {
    return "(function() { g_rgCurrentTradeStatus =" + tradeOfferContent + "; RefreshTradeStatus( g_rgCurrentTradeStatus );})()";
  }

  private buildTradeOfferContent(myItems: CSGOItem[], theirItems: CSGOItem[]) {
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
