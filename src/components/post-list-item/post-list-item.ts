import {Component, Input} from '@angular/core';
import {PostType, Trade} from "../../models/trade.model";

@Component({
  selector: 'post-list-item',
  templateUrl: 'post-list-item.html'
})
export class PostListItem {

  @Input()
  tradePost: Trade;

  constructor() {
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
