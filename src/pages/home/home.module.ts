import {ComponentsModule} from "../../components/components.module";
import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {HomePage} from "./home";

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule
  ],
  exports: [
    HomePage
  ]
})

export class HomePageModule {
}
