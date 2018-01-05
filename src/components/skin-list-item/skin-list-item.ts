import {Component, Input} from '@angular/core';

@Component({
  selector: 'skin-list-item',
  templateUrl: 'skin-list-item.html'
})
export class SkinListItemComponent {

  @Input()
  itemData: any;

  constructor() {

  }

}
