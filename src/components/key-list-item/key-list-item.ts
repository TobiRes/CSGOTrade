import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CSGOItem, SkinCategory} from "../../models/csgoItem.model";
import {Modal, ModalController, ModalOptions} from "ionic-angular";
import {CSGOKey} from "../../models/csgoKey.model";

@Component({
  selector: 'key-list-item',
  templateUrl: 'key-list-item.html'
})
export class KeyListItemComponent {
  itemSelected: boolean = false;

  @Input()
  csgoKeys: CSGOKey;

  @Output()
  selected = new EventEmitter();


  constructor(private modal: ModalController) {

  }

  selectItem() {
    this.itemSelected = !this.itemSelected;
    this.selected.emit(this.csgoKeys);
  }

  onLongPress() {
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("ItemModalPage", {csgoItem: this.csgoKeys}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onWillDismiss((data) => {

    });
  }
}
