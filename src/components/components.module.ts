import {NgModule} from '@angular/core';
import {TradeListItemComponent} from './trade-list-item/trade-list-item';
import {IonicModule} from "ionic-angular";
import {PostListItem} from './post-list-item/post-list-item';

@NgModule({
  declarations: [TradeListItemComponent,
    PostListItem],
  imports: [IonicModule],
  exports: [TradeListItemComponent,
    PostListItem]
})
export class ComponentsModule {
}
