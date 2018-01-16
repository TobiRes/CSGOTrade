import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-item-modal',
  templateUrl: 'item-modal.html',
})
export class ItemModalPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
