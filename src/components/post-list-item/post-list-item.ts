import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostType, RedditPost} from "../../models/redditpost.model";

@Component({
  selector: 'post-list-item',
  templateUrl: 'post-list-item.html'
})
export class PostListItem {

  @Input()
  tradePost: RedditPost;

  @Output()
  selected = new EventEmitter();

  constructor() {
  }

  openPost() {
    this.selected.emit(this.tradePost);
  }

  styleByPostType() {
    switch (this.tradePost.type) {
      case PostType.store:
        return "store";
      case PostType.pricecheck:
        return "pricecheck";
      case PostType.discussion:
        return "discussion";
      case PostType.question:
        return "question";
      case PostType.lph:
        return "lph";
      case PostType.psa:
        return "psa";
      case PostType.free:
        return "free";
      case PostType.important:
        return "important";
      default:
        return "unknown";
    }
  }

}
