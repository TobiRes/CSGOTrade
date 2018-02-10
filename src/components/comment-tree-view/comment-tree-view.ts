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

  @Input()
  commentLevel: number;

  moreCommentsEnabled: boolean;

  constructor() {
  }

  getAuthorStyling(comment: RedditComment) {
    if (this.author == comment.author) {
      return {'color': 'blue'};
    }
    if (comment.author.indexOf("AutoModerator") != -1) {
      return {'color': 'green'};
    }
  }

  enableMoreComments() {
    this.commentLevel = -1;
    this.moreCommentsEnabled = !this.moreCommentsEnabled;
  }
}
