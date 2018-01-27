import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
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

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.csgoKeys = this.navParams.get("csgoKeys");
    this.selectedKeysCount = this.navParams.get("alreadySelectedKeys");
  }

  addKeys() {
    this.getSelectedKeys();
    let keysAndKeyType = {
      selectedKeys: this.selectedKeys,
      keyType: this.csgoKeys.keys[0].fullName
    }

    this.viewCtrl.dismiss(keysAndKeyType);
  }

  private getSelectedKeys() {
    for (let i = 0; i < this.selectedKeysCount; i++) {
      this.selectedKeys.push(this.csgoKeys.keys[i]);
    }
  }
}
