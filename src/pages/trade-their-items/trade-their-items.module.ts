import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TradeTheirItemsPage} from './trade-their-items';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    TradeTheirItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeTheirItemsPage),
    ComponentsModule
  ],
})
export class TradeTheirItemsPageModule {
}
