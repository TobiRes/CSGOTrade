import {Component, OnDestroy} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {CSGOItem} from "../../models/csgoItem.model";
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


  constructor(private viewCtrl: ViewController, public navParams: NavParams, private inAppBrowser: InAppBrowser) {
    this.csgoItem = this.navParams.get("csgoItem");
    this.currentPage = this.navParams.get("currentPage");
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

  addItem() {
    this.viewCtrl.dismiss({csgoItem: this.csgoItem});
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private buildScreenshotScript() {
    return "(function() { csgo.addItemManually('" + this.csgoItem.inspectLink + "')})()";
  }
}
