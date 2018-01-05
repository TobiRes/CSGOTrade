import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostType, Trade} from "../../models/trade.model";


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
  postTypeTrade: PostType = PostType.trade;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentPost = this.navParams.get("postData");
    this.getTitle()
  }


  private getTitle() {
    switch (this.currentPost.type) {
      case PostType.trade:
        this.title = "Trade";
        break;
      case PostType.discussion:
        this.title = "Discussion";
        break;
      case PostType.store:
        this.title = "Store";
        break;
      case PostType.pricecheck:
        this.title = "Pricecheck";
        ;
        break;
      case PostType.question:
        this.title = "Question";
        break;
      case PostType.psa:
        this.title = "PSA";
        break;
      case PostType.free:
        this.title = "Free";
        break;
      case PostType.lph:
        this.title = "<15 Keys Trade";
        break;
      default:
        this.title = "Info";
    }
  }


}