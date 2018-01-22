import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CSGOItem, SkinCategory} from "../../models/csgoItem.model";
import {Modal, ModalController, ModalOptions} from "ionic-angular";

@Component({
  selector: 'skin-list-item',
  templateUrl: 'skin-list-item.html'
})
export class SkinListItemComponent {
  checkType: SkinCategory = SkinCategory.statTrak;
  itemSelected: boolean = false;

  @Input()
  csgoItem: CSGOItem;

  @Output()
  selected = new EventEmitter();


  constructor(private modal: ModalController) {

  }

  selectItem() {
    this.itemSelected = !this.itemSelected;
    this.selected.emit(this.csgoItem);
  }

  onLongPress() {
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("ItemModalPage", {csgoItem: this.csgoItem}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onWillDismiss((data) => {

    });
  }
}
