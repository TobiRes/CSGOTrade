import {Directive, Input, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[hide-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {

  @Input("header") header: HTMLElement
  private headerHeight;
  private scrollContent: any;
  private eventArray: any[] = [];
  private marginTopOfScrollContent: number;

  constructor(public element: ElementRef, public renderer: Renderer2) {
  }


  ngOnInit(){
    //TODO: Set eventcount to show header on upscroll according to the device height
    this.headerHeight = this.header.clientHeight;
    this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
    this.renderer.setStyle(this.header, 'webkitTransition', 'top 1200ms');
    this.renderer.setStyle(this.scrollContent, 'webkitTransition', 'margin-top 1200ms');
  }

  onContentScroll(event){
    this.setMarginOfScrollContent(event.contentTop);
    let scrollTopChecker = this.getScrollTopChecker(event);
    this.setHeaderAndScrollContentPositionAndMargin(event, scrollTopChecker);
  }

  private setMarginOfScrollContent(contentTop) {
    if(!this.marginTopOfScrollContent)
      this.marginTopOfScrollContent = contentTop;
  }

  private getScrollTopChecker(event: any) {
    let scrollTopChecker: number = 0;
    this.eventArray.push(event);
    if(this.eventArray.length > 130){
      this.eventArray.splice(0, 1);
    }
    this.eventArray.forEach( event => {
      if(event.directionY == "up"){
        scrollTopChecker ++;
      }
    });
    return scrollTopChecker;
  }

  private setHeaderAndScrollContentPositionAndMargin(event: any, scrollTopChecker: number) {
    if(event.scrollTop > this.marginTopOfScrollContent && scrollTopChecker < 130) {
      if (event.directionY == "down"){
        this.renderer.setStyle(this.header, "top", "-" + (this.marginTopOfScrollContent + 2) +"px");
        this.renderer.setStyle(this.scrollContent, 'margin-top', '0');
      }
    } else {
      this.renderer.setStyle(this.header, "top", "0");
      this.renderer.setStyle(this.scrollContent, 'margin-top', this.marginTopOfScrollContent + 'px');
      this.eventArray = [];
    }
  }
}
