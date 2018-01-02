import {NgModule} from '@angular/core';
import {TradeListItemComponent} from './trade-list-item/trade-list-item';
import {IonicModule} from "ionic-angular";

@NgModule({
  declarations: [TradeListItemComponent],
  imports: [IonicModule],
  exports: [TradeListItemComponent]
})
export class ComponentsModule {
}
