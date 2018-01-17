import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {CSGOItem, Exterior} from "../../models/csgoItem.model";


@IonicPage()
@Component({
  selector: 'page-item-modal',
  templateUrl: 'item-modal.html',
})
export class ItemModalPage {
  csgoItem: CSGOItem;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.csgoItem = this.navParams.get("csgoItem");
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getExteriorString() {
    switch (this.csgoItem.exterior) {
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

}
