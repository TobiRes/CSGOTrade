import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostType, RedditPost} from "../../models/redditpost.model";

@Component({
  selector: 'trade-list-item',
  templateUrl: 'trade-list-item.html'
})

export class TradeListItemComponent {

  @Input()
  tradePost: RedditPost;

  @Output()
  selected = new EventEmitter();

  @Output()
  sendOffer = new EventEmitter();

  constructor() {
  }

  openPost() {
    this.selected.emit(this.tradePost);
  }

  sendTradeOffer() {
    this.sendOffer.emit(this.tradePost)
  }

  styleByPostType() {
    if(this.tradePost.type == PostType.trade)
      return "trade";
    else if(this.tradePost.type == PostType.store)
      return "store";
    else if(this.tradePost.type == PostType.free)
      return "free";
    else if(this.tradePost.type == PostType.lph)
      return "lph";
  }
}
