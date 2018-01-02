import {Component, Input} from '@angular/core';
import {Trade} from "../../models/trade.model";

@Component({
  selector: 'trade-list-item',
  templateUrl: 'trade-list-item.html'
})

export class TradeListItemComponent {

  @Input()
  tradePost: Trade;

  constructor() {
  }

}
