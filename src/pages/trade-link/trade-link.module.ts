import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeLinkPage } from './trade-link';

@NgModule({
  declarations: [
    TradeLinkPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeLinkPage),
  ],
})
export class TradeLinkPageModule {}
