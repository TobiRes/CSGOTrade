import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InventoryPage} from './inventory';
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    InventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(InventoryPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class InventoryPageModule {
}
