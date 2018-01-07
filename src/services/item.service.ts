import {Injectable} from "@angular/core";
import {CSGOItem, Exterior, Grade, ItemType, SkinCategory} from "../models/item.model";
import {Item} from "ionic-angular";
import {FactoryOrValue} from "rxjs/interfaces";

@Injectable()
export class ItemService {

  itemFullName: string;

  constructor() {
  }


  fillItemMetaData(csgoInventoryItem: any): CSGOItem {
    this.itemFullName = csgoInventoryItem.market_hash_name;
    return {
      name:  this.itemFullName,
      skinCategory: this.getSkinCategory(),
      type: this.getItemType(),
      exterior: this.getSkinExterior(),
      iconUrl: csgoInventoryItem.icon_url,
      inspectLink: csgoInventoryItem.market_actions ?  csgoInventoryItem.market_actions[0].link : "unknown"
     }
  }

  private getItemType(): ItemType {
    //"StatTrak™ Galil AR | Crimson Tsunami (Minimal Wear)"
    let itemPrefix = this.itemFullName. substring(0, this.itemFullName.indexOf("|")).trim().toLowerCase()
    let itemType: ItemType;
    switch(itemPrefix) {
      case "ak-47":
      case "m4a1-s":
      case "m4a4":
      case "galil ar":
      case "famas":
      case "aug":
      case "SG 553":
        itemType = ItemType.rifle;
        break;
      case "g3sg1":
      case "awp":
      case "ssg 08":
      case "scar-20":
        itemType = ItemType.sniperRifle;
        break;
      case "cz75-auto":
      case "desert eagle":
      case "dual berettas":
      case "five-seven":
      case "glock-18":
      case "p2000":
      case "p250":
      case "r8 revolver":
      case "tec-9":
      case "usp-s":
        itemType = ItemType.pistol;
        break;
      case "mac-10":
      case "mp7":
      case "mp9":
      case "pp-bizon":
      case "p90":
      case "ump-45":
        itemType = ItemType.smg;
        break;
      case "mag-7":
      case "nova":
      case "sawed-off":
      case "xm1014":
        itemType = ItemType.shotgun;
        break;
      case "bayonet":
      case "bowie knife":
      case "butterfly knife":
      case "falchion knife":
      case "flip knife":
      case "gut knife":
      case "huntsman knife":
      case "karambit":
      case "m9 bayonet":
      case "shadow daggers":
        itemType = ItemType.knife;
        break;
      default:
        if (itemPrefix.indexOf("case"))
          itemType = ItemType.container;
        if (itemPrefix.indexOf("glove"))
          itemType = ItemType.gloves;
        if (itemPrefix.indexOf("swap"))
          itemType = ItemType.tool;
        if (itemPrefix.indexOf("sticker"))
          itemType = ItemType.sticker;
        if (itemPrefix.indexOf("graffiti"))
          itemType = ItemType.graffiti;
        if (itemPrefix.indexOf("music"))
          itemType = ItemType.musicKit;
        if (itemPrefix.indexOf("key"))
          itemType = ItemType.key;
        if (itemPrefix.indexOf("pass"))
          itemType = ItemType.pass;
        if (itemPrefix.indexOf("gift"))
          itemType = ItemType.gift;
        if (itemPrefix.indexOf("tag")){
          console.log(itemPrefix);
          itemType = ItemType.tag;
        }
        else
          itemType = ItemType.collectible;
        break;
    }
    return itemType;
  }

  private getSkinCategory(): SkinCategory {
    if(this.itemFullName.indexOf("StatTrak") <= 0){
      if(this.itemFullName.indexOf("Souvenir") <= 0){
        return SkinCategory.normal;
      }
      else{
        this.itemFullName.replace("souvenir", "");
        return SkinCategory.souvenir;
      }
    }
    else{
      this.itemFullName.replace("StatTrak™", "")
      return SkinCategory.statTrak;
    }
  }

  private getSkinExterior(): Exterior {
    if(this.itemFullName.indexOf("Factory New"))
      return Exterior.fn
    if(this.itemFullName.indexOf("Minimal Wear"))
      return Exterior.mw;
    if(this.itemFullName.indexOf("Field-Tested"))
      return Exterior.ft
    if(this.itemFullName.indexOf("Well-Worn"))
      return Exterior.ww
    if(this.itemFullName.indexOf("Battle-Scarred"))
      return Exterior.bs
    else
      return Exterior.notPainted
  }
}
