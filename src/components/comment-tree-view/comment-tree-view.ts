import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CSGOItem, SkinCategory} from "../../models/csgoItem.model";
import {Modal, ModalController, ModalOptions} from "ionic-angular";
import {RedditComment} from "../../models/redditpost.model";

@Component({
  selector: 'comment-tree-view',
  templateUrl: 'comment-tree-view.html'
})
export class CommentTreeViewComponent {

  @Input()
  redditComments: RedditComment[];


  constructor() {

  }
}
