import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostType, RedditComment, RedditPost} from "../../models/redditpost.model";
import {RedditService} from "../../services/reddit.service";


@IonicPage()
@Component({
  selector: 'page-post-view',
  templateUrl: 'post-view.html',
})
export class PostViewPage {

  currentPost: RedditPost;
  postComments: RedditComment[] = [];
  postTypeTrade: PostType = PostType.trade;
  title: string;
  isLoading: boolean = true;

  constructor(public navParams: NavParams, private redditService: RedditService) {
    this.currentPost = this.navParams.get("postData");
    this.redditService.getComments(this.currentPost)
      .then((postUpdate: any) => {
        this.isLoading = false;
        this.postComments = postUpdate.allPostComments;
        this.currentPost.likedIt = postUpdate.upvoteRatio;
      })
      .catch(error => console.error(error));
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
