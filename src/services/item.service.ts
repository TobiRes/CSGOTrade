import {Injectable} from "@angular/core";
import {CSGOItem, Exterior, Grade, ItemType, SkinCategory} from "../models/item.model";


@Injectable()
export class ItemService {

  constructor() {
  }


  fillItemMetaData(csgoInventoryItem: any): CSGOItem {
    //e.g. "StatTrak™ Galil AR | Crimson Tsunami (Minimal Wear)"
    let itemFullName = csgoInventoryItem.market_hash_name;

    return {
      name:  itemFullName,
      skinCategory: this.getSkinCategory(itemFullName),
      type: this.getItemType(itemFullName),
      exterior: this.getSkinExterior(itemFullName),
      grade: this.getSkinGrade(csgoInventoryItem),
      iconUrl: csgoInventoryItem.icon_url,
      inspectLink: csgoInventoryItem.market_actions ?  csgoInventoryItem.market_actions[0].link : "unknown"
     }
  }

  private getItemType(itemFullName: string): ItemType {
    let itemPrefix: string = itemFullName.toLowerCase();
    if(itemPrefix.indexOf("|") > 0)
      itemPrefix = itemPrefix.substring(0, itemFullName.indexOf("|")).trim();
    if(itemPrefix.indexOf("stattrak") >= 0){
      itemPrefix = itemPrefix.substring(9, itemPrefix.length).trim();
    }
    let itemType: ItemType;
    switch(itemPrefix) {
      case "ak-47":
      case "m4a1-s":
      case "m4a4":
      case "galil ar":
      case "famas":
      case "aug":
      case "sg 553":
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
      case "★ bayonet":
      case "★ bowie knife":
      case "★ butterfly knife":
      case "★ falchion knife":
      case "★ flip knife":
      case "★ gut knife":
      case "★ huntsman knife":
      case "★ karambit":
      case "★ m9 bayonet":
      case "★ shadow daggers":
        itemType = ItemType.knife;
        break;
      default:
        if (itemPrefix.indexOf("case") > -1){
          itemType = ItemType.container;
          break;
        }
        if (itemPrefix.indexOf("glove") > -1){
          itemType = ItemType.gloves;
          break;
        }
        if (itemPrefix.indexOf("swap") > -1){
          itemType = ItemType.tool;
          break;
        }
        if (itemPrefix.indexOf("sticker") > -1){
          itemType = ItemType.sticker;
          break;
        }
        if (itemPrefix.indexOf("graffiti") > -1){
          itemType = ItemType.graffiti;
          break;
        }
        if (itemPrefix.indexOf("music") > -1){
          itemType = ItemType.gift;
          break;
        }
        if (itemPrefix.indexOf("key") > -1){
          itemType = ItemType.key;
          break;
        }
        if (itemPrefix.indexOf("pass") > -1){
          itemType = ItemType.pass;
          break;
        }
        if (itemPrefix.indexOf("gift") > -1){
          itemType = ItemType.gift;
          break;
        }
        if (itemPrefix.indexOf("tag") > -1){
          itemType = ItemType.tag;
          break;
        }
        else{
          itemType = ItemType.collectible;
        }
        break;
    }
    return itemType;
  }

  private getSkinGrade(csgoItem): Grade {
    if(csgoItem.tags[4] == null){
      return Grade.unknown;
    }
    let skinRarity = this.getSkinRarity(csgoItem.tags);

    switch (skinRarity){
      case "Consumer Grade":
        return Grade.consumer;
      case "Mil-Spec Grade":
        return Grade.milspec;
      case "Industrial Grade":
        return Grade.industrial;
      case "Restricted Grade":
        return Grade.restricted;
      case "Classified":
        return Grade.classified;
      case "Covert":
        return Grade.covert;
      case "Base Grade":
        return Grade.base;
      case "High Grade":
        return Grade.high;
      case "Extraordinary":
        return Grade.extraoridinary;
      case "Exotic":
        return Grade.exotic;
      case "Remarkable":
        return Grade.remarkable;
      case "Contraband":
        return Grade.contraband;
      default:
        return Grade.unknown;
    }
  }

  private getSkinCategory(itemFullName: string): SkinCategory {
     if(itemFullName.indexOf("StatTrak") < 0){
      if(itemFullName.indexOf("Souvenir") < 0){
        return SkinCategory.normal;
      }
      else{
        return SkinCategory.souvenir;
      }
    }
    else{
      return SkinCategory.statTrak;
    }
  }

  private getSkinExterior(itemFullName: string): Exterior {
    if(itemFullName.indexOf("Factory New") >= 0)
      return Exterior.fn
    if(itemFullName.indexOf("Minimal Wear") >= 0)
      return Exterior.mw;
    if(itemFullName.indexOf("Field-Tested") >= 0)
      return Exterior.ft
    if(itemFullName.indexOf("Well-Worn") >= 0)
      return Exterior.ww
    if(itemFullName.indexOf("Battle-Scarred") >= 0)
      return Exterior.bs
    else
      return Exterior.notPainted
  }

  private getSkinRarity(csgoItemTags): string {
    let skinRarity: string = "unknown";
    for(let i = 0; i < csgoItemTags.length; i++){
      Object.keys(csgoItemTags[i]).forEach( key => {
        if(csgoItemTags[i][key] == "Rarity"){
          skinRarity = csgoItemTags[i].name;
        }
      })
    }
    return skinRarity;
  }
}
