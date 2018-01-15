import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CSGOItem, SkinCategory} from "../../models/item.model";

@Component({
  selector: 'skin-list-item',
  templateUrl: 'skin-list-item.html'
})
export class SkinListItemComponent {
  checkType: SkinCategory = SkinCategory.statTrak;

  @Input()
  csgoItem: CSGOItem;

  @Output()
  selected = new EventEmitter();


  constructor() {

  }

  selectItem() {
    this.selected.emit(this.csgoItem);
  }

}
