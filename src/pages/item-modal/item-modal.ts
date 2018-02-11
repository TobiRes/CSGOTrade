import {Component, OnDestroy} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {CSGOItem, ItemType} from "../../models/csgoItem.model";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser";
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
    const options: InAppBrowserOptions = {
      location: "no",
      zoom: "no",
      shouldPauseOnSuspend: "yes"
    }
    let tradeScript = this.buildScreenshotScript();
    const browser = this.inAppBrowser.create("https://metjm.net/csgo/", "_self", options);

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

  metjmIsPossible() {
    if (this.csgoItem.type != ItemType.key
      && this.csgoItem.type != ItemType.collectible
      && this.csgoItem.type != ItemType.gift
      && this.csgoItem.type != ItemType.graffiti
      && this.csgoItem.type != ItemType.tool
      && this.csgoItem.type != ItemType.gloves
      && this.csgoItem.type != ItemType.container
      && this.csgoItem.type != ItemType.musicKit
      && this.csgoItem.type != ItemType.tag) {
      return true;
    }
    return false;
  }

  private buildScreenshotScript() {
    return "(function() { csgo.addItemManually('" + this.csgoItem.inspectLink + "')})()";
  }
}
