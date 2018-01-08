import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {ItemService} from "../../services/item.service";
import {CSGOItem} from "../../models/item.model";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  //"http://steamcommunity.com/profiles/76561198128420241/inventory/json/730/2"
  csgoItems: CSGOItem[];
  steamProfileURL: string;
  selectedSkinTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedGrades: string[] = [];
  selectedExteriors: string[] = [];

  private csgoInventoryData: any;
  private backupCsgoItems: CSGOItem[];


  constructor(private steamService: SteamService,
              private itemService: ItemService,
              private storage: Storage) {

    Promise.all([this.storage.get("csgoItems"), this.storage.get("steamProfileURL")])
      .then(storageData => {
        this.csgoItems = storageData[0];
        this.steamProfileURL = storageData[1];
        if(!this.csgoItems){
          this.getCSGOInventory();
        }
      })
      .catch(error => console.error(error));
  }

  applyFilter() {
    this.csgoItems = this.backupCsgoItems;
    if(this.selectedSkinTypes.length){
      this.filterItems("type", this.selectedSkinTypes);
    }
    if(this.selectedCategories.length){
      this.filterItems("skinCategory", this.selectedCategories);
    }
    if(this.selectedGrades.length){
      this.filterItems("grade", this.selectedGrades);
    }
    if(this.selectedExteriors.length){
      this.filterItems("exterior", this.selectedExteriors);
    }
  }

  getCSGOInventory() {
    if(this.steamProfileURL) {
      this.csgoItems = [];
      this.storage.set("steamProfileURL", this.steamProfileURL);
      this.steamService.getCSGOInventory(this.steamProfileURL)
        .then(csgoInventory => {
          this.csgoInventoryData = csgoInventory;
          Object.keys(this.csgoInventoryData).forEach(key => {
            this.csgoItems.push(this.itemService.fillItemMetaData(this.csgoInventoryData[key]));
          });
          this.storage.set("csgoItems", this.csgoItems);
          this.backupCsgoItems = this.csgoItems;
        })
    }
  }

  private filterItems(propertyToCompare: any, selectedFilter: any[]){
    let completeFilteredItemList: CSGOItem[] = [];
    selectedFilter.forEach( (selectedFilter: any) => {
      completeFilteredItemList = completeFilteredItemList.concat(
        this.csgoItems.filter( singleItem => {
          console.log("selectedFilter", selectedFilter);
          console.log("propertyToCompare", singleItem[propertyToCompare]);
          if(singleItem[propertyToCompare] == selectedFilter)
            return true;
          return false;
        })
      );
    });
    this.csgoItems = completeFilteredItemList;
  }
}
