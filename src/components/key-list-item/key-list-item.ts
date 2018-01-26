import {Component, Input} from '@angular/core';
import {Modal, ModalController, ModalOptions} from "ionic-angular";
import {CSGOKey} from "../../models/csgoKey.model";
import {CSGOItem} from "../../models/csgoItem.model";

@Component({
  selector: 'key-list-item',
  templateUrl: 'key-list-item.html'
})
export class KeyListItemComponent {
  itemSelected: boolean = false;

  @Input()
  csgoKeys: CSGOKey;

  constructor(private modal: ModalController) {

  }

  selectItem() {
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("KeyModalPage", {csgoKeys: this.csgoKeys}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onDidDismiss((selectedKeys: CSGOItem[]) => {
      console.log(selectedKeys);
    });
  }

  onLongPress() {
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("ItemModalPage", {csgoItem: this.csgoKeys}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onDidDismiss((selectedKeys: CSGOItem[]) => {
      console.log("test", selectedKeys);
    });
  }
}
