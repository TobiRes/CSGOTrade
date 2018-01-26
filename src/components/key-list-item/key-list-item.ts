import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Modal, ModalController, ModalOptions} from "ionic-angular";
import {CSGOKey} from "../../models/csgoKey.model";

@Component({
  selector: 'key-list-item',
  templateUrl: 'key-list-item.html'
})
export class KeyListItemComponent {

  @Input()
  csgoKeys: CSGOKey;

  @Input()
  alreadySelectedKeys: number;

  @Output()
  selected = new EventEmitter();

  constructor(private modal: ModalController) {

  }

  selectItem() {
    const csgoItemModalOptions: ModalOptions = {
      cssClass: "csgoItemModal",
      showBackdrop: true
    }
    const itemModal: Modal = this.modal.create("KeyModalPage", {csgoKeys: this.csgoKeys, alreadySelectedKeys: this.alreadySelectedKeys}, csgoItemModalOptions);
    itemModal.present();
    itemModal.onDidDismiss(keysAndKeyType => {
      this.selected.emit({selectedKeys: keysAndKeyType.selectedKeys, currentKeyType: keysAndKeyType.keyType});
    });
  }
}
