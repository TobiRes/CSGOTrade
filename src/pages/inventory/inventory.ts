import {Component} from '@angular/core';
import {IonicPage, Item, NavController, NavParams} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {ItemService} from "../../services/item.service";
import {CSGOItem, ItemType} from "../../models/item.model";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  //"http://steamcommunity.com/profiles/76561198128420241/inventory/json/730/2"
  csgoItems: CSGOItem[];
  steamInventoryURL: string;
  selectedSkinTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedGrades: string[] = [];
  selectedExteriors: string[] = [];

  private csgoInventoryData: any;
  private backupCsgoItems: CSGOItem[];


  constructor(private steamService: SteamService, private itemService: ItemService) {
    this.csgoItems = [];
    if(this.steamInventoryURL){
      this.getCSGOInventory()
    }
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
    this.steamService.getCSGOInventory(this.steamInventoryURL)
      .then(csgoInventory => {
        this.csgoInventoryData = csgoInventory;
        Object.keys(this.csgoInventoryData).forEach(key => {
          this.csgoItems.push(this.itemService.fillItemMetaData(this.csgoInventoryData[key]));
        });
      });
    this.backupCsgoItems = this.csgoItems
    console.log(this.csgoItems);
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
