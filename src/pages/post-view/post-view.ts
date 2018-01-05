import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostType, Trade} from "../../models/trade.model";
import marked from 'marked';


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
  @ViewChild(Content) content: Content;

  currentPost: Trade;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentPost = this.navParams.get("postData");
    this.getTitle()
    this.formatPost();
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

  private formatPost(){
    console.log(marked(this.currentPost.content.toString()))
    let markdownText = marked(this.currentPost.content.toString());
    this.content = markdownText;
  }
}
