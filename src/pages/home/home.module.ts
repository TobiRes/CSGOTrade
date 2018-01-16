import {ComponentsModule} from "../../components/components.module";
import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {HomePage} from "./home";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule,
    DirectivesModule
  ],
  exports: [
    HomePage
  ]
})

export class HomePageModule {
}
