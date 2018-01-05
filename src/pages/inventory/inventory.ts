import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam-service";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  inventoryItemNames: any[];
  private csgoInventoryData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private steamService: SteamService) {
    this.inventoryItemNames = [];
    this.getCSGOInventory()
  }

  private getCSGOInventory() {
    this.steamService.getCSGOInventory()
      .then(csgoInventory => {
        this.csgoInventoryData = csgoInventory;
        Object.keys(this.csgoInventoryData).forEach(key => {
          this.inventoryItemNames.push(this.csgoInventoryData[key].market_hash_name);
        });
        console.log(this.inventoryItemNames);
      });
  }

}
