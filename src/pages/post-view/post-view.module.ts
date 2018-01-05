import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostViewPage} from './post-view';

@NgModule({
  declarations: [
    PostViewPage,
  ],
  imports: [
    IonicPageModule.forChild(PostViewPage),
  ],
})
export class PostViewPageModule {
}
