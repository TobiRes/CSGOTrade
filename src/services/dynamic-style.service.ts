import {Injectable} from "@angular/core";
import {CSGOItem, SkinCategory} from "../models/item.model";

@Injectable()
export class DynamicStyleService {

  constructor() {
  }


  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    if (csgoItem.skinCategory == SkinCategory.normal)
      return "";
    if (csgoItem.skinCategory == SkinCategory.statTrak)
      return {"border": "1px solid orangered"};
    else
      return {"border": "1px solid yellow"};
  }
}
