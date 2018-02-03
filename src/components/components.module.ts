import {NgModule} from '@angular/core';
import {TradeListItemComponent} from './trade-list-item/trade-list-item';
import {IonicModule} from "ionic-angular";
import {PostListItem} from './post-list-item/post-list-item';
import {PostContentComponent} from './post-content/post-content';
import {PipesModule} from "../pipes/pipes.module";
import {SkinListItemComponent} from './skin-list-item/skin-list-item';
import {DirectivesModule} from "../directives/directives.module";
import {KeyListItemComponent} from './key-list-item/key-list-item';
import {CommentTreeViewComponent} from './comment-tree-view/comment-tree-view';

@NgModule({
  declarations: [TradeListItemComponent,
    PostListItem,
    PostContentComponent,
    SkinListItemComponent,
    KeyListItemComponent,
    CommentTreeViewComponent],
  imports: [IonicModule, PipesModule, DirectivesModule],
  exports: [TradeListItemComponent,
    PostListItem,
    PostContentComponent,
    SkinListItemComponent,
    KeyListItemComponent,
    CommentTreeViewComponent]
})
export class ComponentsModule {
}
