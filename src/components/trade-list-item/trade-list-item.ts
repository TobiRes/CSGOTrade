import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trade} from "../../models/redditpost.model";

@Component({
  selector: 'trade-list-item',
  templateUrl: 'trade-list-item.html'
})

export class TradeListItemComponent {

  @Input()
  tradePost: Trade;

  @Output()
  selected = new EventEmitter();

  constructor() {
  }

  openPost() {
    this.selected.emit(this.tradePost);
  }

}
