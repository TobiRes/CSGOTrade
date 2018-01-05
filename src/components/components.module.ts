import {NgModule} from '@angular/core';
import {TradeListItemComponent} from './trade-list-item/trade-list-item';
import {IonicModule} from "ionic-angular";
import {PostListItem} from './post-list-item/post-list-item';
import { PostContentComponent } from './post-content/post-content';

@NgModule({
  declarations: [TradeListItemComponent,
    PostListItem,
    PostContentComponent],
  imports: [IonicModule],
  exports: [TradeListItemComponent,
    PostListItem,
    PostContentComponent]
})
export class ComponentsModule {
}
