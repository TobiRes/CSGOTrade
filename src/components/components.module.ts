import {NgModule} from '@angular/core';
import {TradeListItemComponent} from './trade-list-item/trade-list-item';
import {IonicModule} from "ionic-angular";
import {PostListItem} from './post-list-item/post-list-item';
import { PostContentComponent } from './post-content/post-content';
import {PipesModule} from "../pipes/pipes.module";

@NgModule({
  declarations: [TradeListItemComponent,
    PostListItem,
    PostContentComponent],
  imports: [IonicModule, PipesModule],
  exports: [TradeListItemComponent,
    PostListItem,
    PostContentComponent]
})
export class ComponentsModule {
}
