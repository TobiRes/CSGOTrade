import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchRedditPage } from './search-reddit';
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    SearchRedditPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchRedditPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class SearchRedditPageModule {}
