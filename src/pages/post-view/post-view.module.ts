import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostViewPage} from './post-view';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    PostViewPage,
  ],
  imports: [
    IonicPageModule.forChild(PostViewPage),
    ComponentsModule
  ],
})
export class PostViewPageModule {
}
