import {Injectable} from "@angular/core";
import {CSGOItem, Exterior, Grade, ItemType, SkinCategory} from "../models/csgoItem.model";
import {CSGOKey} from "../models/csgoKey.model";


@Injectable()
export class CSGOItemService {

  constructor() {
  }

  fillItemMetaData(csgoInventoryItem: any): CSGOItem {
    //e.g. "StatTrak™ Galil AR | Crimson Tsunami (Minimal Wear)"
    let itemFullName = csgoInventoryItem.market_hash_name;
    let csgoItem: CSGOItem = {
      fullName: itemFullName,
      name: csgoInventoryItem.name,
      skinCategory: this.getSkinCategory(itemFullName),
      type: this.getItemType(itemFullName),
      grade: this.getSkinGrade(csgoInventoryItem),
      iconUrl: csgoInventoryItem.icon_url,
      inspectLink: csgoInventoryItem.market_actions ? csgoInventoryItem.market_actions[0].link : "unknown",
      classId: csgoInventoryItem.classid,
      tradable: this.getTradeableStatus(csgoInventoryItem.tradable)
    }
    csgoItem = this.getSkinExterior(csgoItem);
    csgoItem = this.fillAdditionalInformation(csgoInventoryItem, csgoItem);
    return csgoItem;
  }

  addAssetIds(csgoInventoryData: CSGOItem[], inventoryIds: any) {
    let csgoItems: CSGOItem[] = csgoInventoryData;
    csgoItems.forEach((csgoItem: CSGOItem) => {
      csgoItem.assetId = this.getMatchingAssetId(csgoItem.classId, inventoryIds)
    })
    return csgoItems;
  }

  mapExterior(selectedExteriors: string[]) {
    let exteriors: string[] = [];
    selectedExteriors.forEach(exterior => {
      switch (exterior) {
        case "Factory New":
          exteriors.push("FN");
          break;
        case "Minimal Wear":
          exteriors.push("MW");
          break;
        case "Field-Tested":
          exteriors.push("FT");
          break;
        case "Well-Worn":
          exteriors.push("WW");
          break;
        default:
          exteriors.push("BS");
          break;
      }
    });
    return exteriors;
  }

  mapSkinCategory(selectedCategories: string[]) {
    let categories: string[] = [];
    selectedCategories.forEach(category => {
      switch (category) {
        case "StatTrak":
          categories.push("ST");
          break;
        case "Souvenir":
          categories.push("SV");
          break;
        default:
          categories.push("Normal");
          break;
      }
    });
    return categories;
  }

  getTradeableItems(csgoItems: CSGOItem[]): CSGOItem[] {
    let tradeableItems: CSGOItem[] = [];
    csgoItems.forEach(csgoItem => {
      if (csgoItem.tradable)
        tradeableItems.push(csgoItem)
    });
    return tradeableItems;
  }

  sortByKeyAndGrade(csgoItems: CSGOItem[]){
    let itemsToSort: CSGOItem[] = csgoItems.slice();
    let sortedItems: CSGOItem[] = [];
    for(let i = itemsToSort.length-1; i >= 0; i--){
      if(itemsToSort[i].type == ItemType.key){
        sortedItems.push(itemsToSort[i]);
        itemsToSort.splice(i, 1);
      }
    }

    for(let i = itemsToSort.length-1; i >= 0; i--){
      if(itemsToSort[i].grade == Grade.covert
        || itemsToSort[i].grade == Grade.contraband
        || itemsToSort[i].grade == Grade.extraoridinary){
        sortedItems.push(itemsToSort[i]);
        itemsToSort.splice(i, 1);
      }
    }

    for(let i = itemsToSort.length-1; i >= 0; i--){
      if(itemsToSort[i].grade == Grade.classified
        || itemsToSort[i].grade == Grade.remarkable
        || itemsToSort[i].grade == Grade.exotic){
        sortedItems.push(itemsToSort[i]);
        itemsToSort.splice(i, 1);
      }
    }

    for(let i = itemsToSort.length-1; i >= 0; i--){
      if(itemsToSort[i].grade != Grade.base
        || itemsToSort[i].grade != Grade.industrial
        || itemsToSort[i].grade != Grade.consumer ){
        sortedItems.push(itemsToSort[i]);
        itemsToSort.splice(i, 1);
      }
    }

    for(let i = itemsToSort.length -1; i >= 0; i--){
      sortedItems.push(itemsToSort[i]);
      itemsToSort.splice(i, 1);
    }

    return sortedItems;
  }

  splitIntoItemsAndKeys(csgoItems: CSGOItem[]){
    //TODO: FIX ONLY ONE TYPE KEY BEING SHOWN
    //TODO: DEEP COPY ALL ARRAYS
    let allKeys: CSGOKey[] = [];
    let csgoKeys: CSGOKey = { keys: [], count: 0};
    let stillKeysLeft: boolean = true;
    let currentKeyTypeToSearchFor: string = "";
    let copyOfCsgoItems = csgoItems.slice();

    while(stillKeysLeft){
      for(let i = copyOfCsgoItems.length-1; i >= 0; i--) {
        if(copyOfCsgoItems[i].type == ItemType.key){
          currentKeyTypeToSearchFor = copyOfCsgoItems[i].fullName;
          break;
        }
      }
      if(!currentKeyTypeToSearchFor) {
        stillKeysLeft = false;
        break;
      }
      for(let i = copyOfCsgoItems.length-1; i >= 0; i--) {
        if(copyOfCsgoItems[i].fullName == currentKeyTypeToSearchFor){
          csgoKeys.keys.push(copyOfCsgoItems[i]);
          csgoKeys.count++;
          copyOfCsgoItems.splice(i, 1);
          console.log(csgoKeys);
        }
      }
      allKeys.push(csgoKeys);
      csgoKeys = { keys: [], count: 0};
      currentKeyTypeToSearchFor = "";
    }
    return allKeys;
  }

  private getMatchingAssetId(csgoItemClassId: number, inventoryIds: any) {
    let assetId: number = 0;
    Object.keys(inventoryIds).forEach((csgoItemData: any) => {
      if (inventoryIds[csgoItemData].classid == csgoItemClassId)
        assetId = inventoryIds[csgoItemData].id;
    });
    return assetId;
  }

  private getItemType(itemFullName: string): ItemType {
    let itemPrefix: string = itemFullName.toLowerCase();
    if (itemPrefix.indexOf("|") > 0)
      itemPrefix = itemPrefix.substring(0, itemFullName.indexOf("|")).trim();
    if (itemPrefix.indexOf("stattrak") >= 0) {
      itemPrefix = itemPrefix.substring(9, itemPrefix.length).trim();
    }
    let itemType: ItemType;
    switch (itemPrefix) {
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
        if (itemPrefix.indexOf("key") > -1) {
          itemType = ItemType.key;
          break;
        }
        else if (itemPrefix.indexOf("case") > -1) {
          itemType = ItemType.container;
          break;
        }
        else if (itemPrefix.indexOf("glove") > -1) {
          itemType = ItemType.gloves;
          break;
        }
        else if (itemPrefix.indexOf("swap") > -1) {
          itemType = ItemType.tool;
          break;
        }
        else if (itemPrefix.indexOf("stickerUrl") > -1) {
          itemType = ItemType.sticker;
          break;
        }
        else if (itemPrefix.indexOf("graffiti") > -1) {
          itemType = ItemType.graffiti;
          break;
        }
        else if (itemPrefix.indexOf("music") > -1) {
          itemType = ItemType.gift;
          break;
        }
        else if (itemPrefix.indexOf("key") > -1) {
          itemType = ItemType.key;
          break;
        }
        else if (itemPrefix.indexOf("pass") > -1) {
          itemType = ItemType.pass;
          break;
        }
        else if (itemPrefix.indexOf("gift") > -1) {
          itemType = ItemType.gift;
          break;
        }
        else if (itemPrefix.indexOf("tag") > -1) {
          itemType = ItemType.tag;
          break;
        }
        else {
          itemType = ItemType.collectible;
        }
        break;
    }
    return itemType;
  }

  private getSkinGrade(csgoItem): Grade {
    if (csgoItem.tags[4] == null) {
      return Grade.unknown;
    }
    let skinRarity = this.getSkinRarity(csgoItem.tags);

    switch (skinRarity) {
      case "Rarity_Common_Weapon":
        return Grade.consumer;
      case "Rarity_Rare_Weapon":
        return Grade.milspec;
      case "Rarity_Uncommon_Weapon":
        return Grade.industrial;
      case "Rarity_Mythical_Weapon":
        return Grade.restricted;
      case "Rarity_Legendary_Weapon":
        return Grade.classified;
      case "Rarity_Ancient_Weapon":
        return Grade.covert;
      case "Rarity_Common":
        return Grade.base;
      case "Rarity_Rare":
        return Grade.high;
      case "Rarity_Ancient":
        return Grade.extraoridinary;
      case "Rarity_Legendary":
        return Grade.exotic;
      case "Rarity_Mythical":
        return Grade.remarkable;
      case "Rarity_Contraband":
        return Grade.contraband;
      default:
        return Grade.unknown;
    }
  }

  private getSkinCategory(itemFullName: string): SkinCategory {
    if (itemFullName.indexOf("StatTrak") < 0) {
      if (itemFullName.indexOf("Souvenir") < 0) {
        return SkinCategory.normal;
      }
      else {
        return SkinCategory.souvenir;
      }
    }
    else {
      return SkinCategory.statTrak;
    }
  }

  private getSkinExterior(item: CSGOItem): CSGOItem {
    let csgoItem: CSGOItem = item;
    if (csgoItem.fullName.indexOf("Factory New") >= 0){
      csgoItem.shortExterior = Exterior.fn;
      csgoItem.longExterior = "Factory New";
    }
    else if (csgoItem.fullName.indexOf("Minimal Wear") >= 0){
      csgoItem.shortExterior = Exterior.mw;
      csgoItem.longExterior = "Minimal Wear";
    }
    else if (csgoItem.fullName.indexOf("Field-Tested") >= 0) {
      csgoItem.shortExterior = Exterior.ft;
      csgoItem.longExterior = "Field-Tested";
    }
    else if (csgoItem.fullName.indexOf("Well-Worn") >= 0){
      csgoItem.shortExterior = Exterior.ww;
      csgoItem.longExterior = "Well-Worn";
    }
    else if (csgoItem.fullName.indexOf("Battle-Scarred") >= 0){
      csgoItem.shortExterior = Exterior.bs;
      csgoItem.longExterior = "Battle-Scarred";
    }
    else{
      csgoItem.shortExterior = Exterior.notPainted;
      csgoItem.longExterior = "Not Painted";
    }

    return csgoItem;
  }

  private getSkinRarity(csgoItemTags): string {
    let skinRarity: string = "unknown";
    for (let i = 0; i < csgoItemTags.length; i++) {
      Object.keys(csgoItemTags[i]).forEach(key => {
        if (csgoItemTags[i][key] == "Rarity") {
          skinRarity = csgoItemTags[i].internal_name;
        }
      })
    }
    return skinRarity;
  }

  private getTradeableStatus(tradable: number) {
    if (tradable == 1)
      return true;
    else
      return false;
  }

  private fillAdditionalInformation(csgoInventoryItem: any, csgoItem: CSGOItem) {
    let collection: string = this.getCollection(csgoInventoryItem.tags);
    let stickerUrls: string[] = this.getStickers(csgoInventoryItem.descriptions);
    if(csgoItem.skinCategory == SkinCategory.statTrak){
      csgoItem.statTrakCount = this.getStatTrackCount(csgoInventoryItem.descriptions);
    }
    if(csgoInventoryItem.fraudwarnings){
      csgoItem.nameTag = this.getNameTag(csgoInventoryItem.fraudwarnings[0]);
    }
    if(collection.length){
      csgoItem.collection = collection;
    }
    if(stickerUrls.length){
      csgoItem.stickerUrl = stickerUrls;
    }
    return csgoItem;
  }

  private getStickers(csgoDescriptions: any[]){
    let stickerUrls: string[] = [];
    csgoDescriptions.forEach(description => {
      if(description.value.indexOf("<br>") == 0){
        stickerUrls = this.getStickerUrlsFromHTMLString(description.value);
      }
    });
    return stickerUrls;
  }

  private getStickerUrlsFromHTMLString(htmlString: string) {
    let stickerUrls = htmlString.match(/src="([^"]+)"/g)
    for(let i = 0; i < stickerUrls.length; i++){
      stickerUrls[i] = stickerUrls[i].replace("src=", "");
      stickerUrls[i] = stickerUrls[i].replace('"', "");
      stickerUrls[i] = stickerUrls[i].replace('"', "");
    }
    return stickerUrls;
  }

  private getStatTrackCount(csgoDescription: any[]){
    let statTrackCount: string = "";
    csgoDescription.forEach(csgoDescription => {
      if(csgoDescription.value.indexOf("StatTrak") == 0){
        statTrackCount = csgoDescription.value.replace( /^\D+/g, '');
      }
    })
    return statTrackCount;
  }

  private getNameTag(csgoItemFraudWarnings: string){
    let startIndexOfNameTag = csgoItemFraudWarnings.indexOf("''") + 2;
    let lastIndexOfNameTag = csgoItemFraudWarnings.lastIndexOf("''");
    return csgoItemFraudWarnings.substring(startIndexOfNameTag, lastIndexOfNameTag);
  }

  private getCollection(csgoItemTags: any[]){
    let collection: string = "";
    csgoItemTags.forEach(tag => {
      if(tag.internal_name.indexOf("set") == 0){
        collection = tag.name;
      }
    })
    return collection;
  }
}
