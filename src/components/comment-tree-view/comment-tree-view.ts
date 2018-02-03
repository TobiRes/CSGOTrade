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

  getAuthorStyling(comment) {
    if(comment.author.indexOf("AutoModerator") != 0){
      if(this.author == comment.author){
          return {'color' : 'blue'};
      }
    } else {
      return {'color' : 'green'};
    }
  }
}
