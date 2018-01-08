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

  csgoItems: CSGOItem[];
  selectedSkinTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedGrades: string[] = [];
  selectedExteriors: string[] = [];

  private csgoInventoryData: any;
  private backupCsgoItems: CSGOItem[];

  constructor(private steamService: SteamService, private itemService: ItemService) {
    this.csgoItems = [];
    this.getCSGOInventory()
  }


  applyFilter() {
    this.csgoItems = this.backupCsgoItems;
    if(this.selectedSkinTypes.length){
      this.filterByType();
    }
    if(this.selectedCategories.length){
      this.filterByCategory();
    }
    if(this.selectedGrades.length){
      this.filterByGrade();
    }
    if(this.selectedExteriors.length){
      this.filterByExterior();
    }
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
    this.backupCsgoItems = this.csgoItems
    console.log(this.csgoItems);
  }


  private filterByType() {
    let completeFilteredItemList: CSGOItem[] = [];
    this.selectedSkinTypes.forEach( (selectedType: string) => {
      completeFilteredItemList = completeFilteredItemList.concat(
        this.csgoItems.filter( singleItem => {
          if(ItemType[singleItem.type] == ItemType[selectedType])
            return true;
          return false;
        })
      );
    });
    this.csgoItems = completeFilteredItemList;
  }

  private filterByCategory() {

  }

  private filterByGrade() {

  }

  private filterByExterior() {

  }
}
