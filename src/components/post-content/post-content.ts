import {Component, Input, ViewChild} from '@angular/core';
import marked from 'marked';
import {Content} from "ionic-angular";


@Component({
  selector: 'post-content',
  templateUrl: 'post-content.html'
})
export class PostContentComponent {
  @ViewChild(Content) content: Content;

  @Input()
  set postContent(postContent: string) {
    let markdownText = marked(postContent);
    this.content = markdownText;
  }

}
