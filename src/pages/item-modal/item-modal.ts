import {Component, OnDestroy} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {CSGOItem, Exterior} from "../../models/csgoItem.model";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";


@IonicPage()
@Component({
  selector: 'page-item-modal',
  templateUrl: 'item-modal.html',
})
export class ItemModalPage implements OnDestroy {

  csgoItem: CSGOItem;
  currentPage: string;
  private destroyed$ = new Subject<void>();


  constructor(public viewCtrl: ViewController, public navParams: NavParams, private inAppBrowser: InAppBrowser) {
    this.csgoItem = this.navParams.get("csgoItem");
    this.currentPage = this.navParams.get("currentPage")
    console.log(this.csgoItem)
  }

  showMetjm() {
    const browser = this.inAppBrowser.create("https://metjm.net/csgo/");
    let tradeScript = this.buildScreenshotScript();
    console.log(tradeScript);

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

  getExteriorString() {
    switch (this.csgoItem.shortExterior) {
      case Exterior.fn:
        return "Factory New";
      case Exterior.mw:
        return "Minimal Wear";
      case Exterior.ft:
        return "Field-Tested";
      case Exterior.ww:
        return "Well-Worn";
      case Exterior.bs:
        return "Battle-Scarred"
      default:
        return "";
    }
  }

  private buildScreenshotScript() {
    return "(function() { csgo.addItemManually('" + this.csgoItem.inspectLink + "')})()";
  }

}
