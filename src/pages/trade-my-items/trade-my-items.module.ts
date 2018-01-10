import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeMyItemsPage } from './trade-my-items';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    TradeMyItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeMyItemsPage),
    ComponentsModule
  ],
})
export class TradeMyItemsPageModule {}
