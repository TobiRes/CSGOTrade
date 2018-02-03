import {Component, Input} from '@angular/core';
import {RedditComment} from "../../models/redditpost.model";

@Component({
  selector: 'comment-tree-view',
  templateUrl: 'comment-tree-view.html'
})
export class CommentTreeViewComponent {

  @Input()
  redditComments: RedditComment[];

  @Input()
  author: string;


  constructor() {
  }
}
