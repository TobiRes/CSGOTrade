import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TradeTheirItemsPage} from './trade-their-items';

@NgModule({
  declarations: [
    TradeTheirItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeTheirItemsPage),
  ],
})
export class TradeTheirItemsPageModule {
}
