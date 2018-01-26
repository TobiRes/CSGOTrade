import {Injectable} from "@angular/core";
import {CSGOItem, SkinCategory} from "../models/csgoItem.model";

@Injectable()
export class DynamicStyleService {

  constructor() {
  }


  setBorderColorIfNotNormalCategory(csgoItem: CSGOItem) {
    if (csgoItem.skinCategory == SkinCategory.normal)
      return "";
    if (csgoItem.skinCategory == SkinCategory.statTrak)
      return {"border": "1px solid #FF7200"};
    else
      return {"border": "1px solid yellow"};
  }
}
