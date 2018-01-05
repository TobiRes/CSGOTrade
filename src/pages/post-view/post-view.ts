import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trade} from "../../models/trade.model";


@IonicPage({
  name: "post-view",
  segment: "post-view",
  defaultHistory: ["home"]
})
@Component({
  selector: 'page-post-view',
  templateUrl: 'post-view.html',
})
export class PostViewPage {
  currentPost: Trade;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentPost = this.navParams.get("postData");
  }


}
