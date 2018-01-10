import {Component, Input, Output} from '@angular/core';

@Component({
  selector: 'skin-list-item',
  templateUrl: 'skin-list-item.html'
})
export class SkinListItemComponent {

  @Input()
  csgoItem: any;

  @Output()
  selected: any

  constructor() {

  }

}
