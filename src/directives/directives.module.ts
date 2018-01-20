import {NgModule} from '@angular/core';
import {HideHeaderDirective} from './hide-header/hide-header';
import {LongPressDirective} from './longpress/long-press';

@NgModule({
  declarations: [HideHeaderDirective,
    LongPressDirective],
  imports: [],
  exports: [HideHeaderDirective,
    LongPressDirective]
})
export class DirectivesModule {
}
