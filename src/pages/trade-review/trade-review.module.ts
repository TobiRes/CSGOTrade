import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TradeReviewPage} from './trade-review';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    TradeReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeReviewPage),
    ComponentsModule
  ],
})
export class TradeReviewPageModule {
}
