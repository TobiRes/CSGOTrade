import {Injectable} from "@angular/core";
import {CSGOItem} from "../models/item.model";

@Injectable()
export class ItemService {

  constructor() {
  }


  fillItemMetaData(csgoInventoryItem: any) {
    let itemFullName = csgoInventoryItem.market_hash_name;
     let item: CSGOItem = {
       name: itemFullName,
       type: this.getItemType(itemFullName),
       skinCategory: this.getSkinCategory(itemFullName),
       grade: this.getSkinGrade(itemFullName),
       exterior: this.getSkinExterior(csgoInventoryItem.descriptions[0].value),
       iconUrl: csgoInventoryItem.icon_url,
       inspectLink: csgoInventoryItem.market_actions[0].link
     }
  }

  private getItemType(itemFullName: any) {

  }

  private getSkinCategory(itemFullName: any) {

  }

  private getSkinGrade(itemFullName: any) {

  }

  private getSkinExterior(value) {

  }
}
