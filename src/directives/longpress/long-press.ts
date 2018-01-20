import {Gesture} from "ionic-angular";
import {Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  pressGesture: Gesture;

  @Output()
  longPress: EventEmitter<any> = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.pressGesture = new Gesture(this.el);
    this.pressGesture.listen();
    this.pressGesture.on('press', e => {
      this.longPress.emit(e);
    })
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }
}
