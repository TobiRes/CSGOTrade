import {Component} from '@angular/core';
import {IonicPage, Item, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {ItemService} from "../../services/item.service";
import {CSGOItem} from "../../models/item.model";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  csgoItems: CSGOItem[];
  private csgoInventoryData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private steamService: SteamService, private itemService: ItemService) {
    this.csgoItems = [];
    this.getCSGOInventory()
  }

  private getCSGOInventory() {
    this.steamService.getCSGOInventory()
      .then(csgoInventory => {
        this.csgoInventoryData = csgoInventory;
        console.log(this.csgoInventoryData);
        Object.keys(this.csgoInventoryData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(this.csgoInventoryData[key]));
        });
      });
    console.log(this.csgoItems);
  }

}
