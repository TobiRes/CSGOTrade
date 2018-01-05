import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {ItemService} from "../../services/item.service";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  inventoryItemNames: any[];
  private csgoInventoryData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private steamService: SteamService, private itemService: ItemService) {
    this.inventoryItemNames = [];
    this.getCSGOInventory()
  }

  private getCSGOInventory() {
    this.steamService.getCSGOInventory()
      .then(csgoInventory => {
        this.csgoInventoryData = csgoInventory;
        Object.keys(this.csgoInventoryData).forEach(key => {
          this.inventoryItemNames.push(this.itemService.fillItemMetaData(this.csgoInventoryData[key]));
        });
      });
  }

}
