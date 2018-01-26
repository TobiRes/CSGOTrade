import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {CSGOKey} from "../../models/csgoKey.model";
import {CSGOItem} from "../../models/csgoItem.model";


@IonicPage()
@Component({
  selector: 'page-key-modal',
  templateUrl: 'key-modal.html',
})
export class KeyModalPage {

  csgoKeys: CSGOKey;
  selectedKeysCount: number;
  selectedKeys: CSGOItem[] = [];

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private inAppBrowser: InAppBrowser) {
    this.csgoKeys = this.navParams.get("csgoKeys");
  }

  addKeys(){
    this.getSelectedKeys();
    this.viewCtrl.dismiss(this.selectedKeys);
  }

  private getSelectedKeys() {
    for(let i = 0; i < this.selectedKeysCount; i++){
      this.selectedKeys.push(this.csgoKeys.keys[i]);
    }
  }
}
