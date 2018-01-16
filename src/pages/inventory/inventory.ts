import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {SteamService} from "../../services/steam.service";
import {CSGOItemService} from "../../services/csgoItem.service";
import {CSGOItem} from "../../models/csgoItem.model";
import {Storage} from "@ionic/storage";
import {DynamicStyleService} from "../../services/dynamic-style.service";

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  csgoItems: CSGOItem[] = [];
  steamProfileURL: string;
  selectedSkinTypes: string[] = [];
  selectedCategories: string[] = [];
  selectedGrades: string[] = [];
  selectedExteriors: string[] = [];
  isLoading: boolean = true;

  private csgoInventoryData: any;
  private backupCsgoItems: CSGOItem[];


  constructor(private steamService: SteamService,
              private itemService: CSGOItemService,
              private storage: Storage,
              private dynStyleService: DynamicStyleService) {

    this.isLoading = true;
    Promise.all([this.storage.get("csgoItems"), this.storage.get("steamProfileURL")])
      .then(storageData => {
        this.csgoItems = storageData[0];
        this.backupCsgoItems = this.csgoItems;
        this.steamProfileURL = storageData[1];
        if (!this.csgoItems) {
          this.getCSGOInventory();
        } else {
          this.isLoading = false;
        }
      })
      .catch(error => console.error(error));
  }

  applyFilter() {
    this.csgoItems = this.backupCsgoItems;
    if (this.selectedSkinTypes.length) {
      this.filterItems("type", this.selectedSkinTypes);
    }
    if (this.selectedCategories.length) {
      let categories: string[] = this.itemService.mapSkinCategory(this.selectedCategories);
      this.filterItems("skinCategory", categories);
    }
    if (this.selectedGrades.length) {
      this.filterItems("grade", this.selectedGrades);
    }
    if (this.selectedExteriors.length) {
      let exteriors: string[] = this.itemService.mapExterior(this.selectedExteriors);
      this.filterItems("exterior", exteriors);
    }
  }

  getCSGOInventory() {
    this.isLoading = true;
    if (this.steamProfileURL) {
      this.csgoItems = [];
      this.storage.set("steamProfileURL", this.steamProfileURL);
      this.steamService.getCSGOInventory(this.steamProfileURL)
        .then((csgoInventory: any) => {
          this.csgoInventoryData = csgoInventory.rgDescriptions;
          Object.keys(this.csgoInventoryData).forEach(key => {
            this.csgoItems.push(this.itemService.fillItemMetaData(this.csgoInventoryData[key]));
          });
          this.itemService.addAssetIds(this.csgoItems, csgoInventory.rgInventory)
          this.isLoading = false;
          this.storage.set("csgoItems", this.csgoItems)
            .then(() => {
              this.backupCsgoItems = this.csgoItems;
            })
            .catch(error => {
              console.error(error)
            });
        })
        .catch(error => {
          this.isLoading = false;
          console.error(error)
        });
    }
  }

  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    return this.dynStyleService.setBorderColorIfNotNormalCategory(csgoItem);
  }

  private filterItems(propertyToCompare: any, selectedFilter: any[]) {
    let completeFilteredItemList: CSGOItem[] = [];
    selectedFilter.forEach((selectedFilter: any) => {
      completeFilteredItemList = completeFilteredItemList.concat(
        this.csgoItems.filter(singleItem => {
          if (singleItem[propertyToCompare] == selectedFilter)
            return true;
          return false;
        })
      );
    });
    this.csgoItems = completeFilteredItemList;
  }
}
