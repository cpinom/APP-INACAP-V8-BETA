import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  @Output() longPress = new EventEmitter<void | any>();

  private timeoutId: any;
  private isLongPress = false;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isLongPress = false;
    this.timeoutId = setTimeout(() => {
      this.isLongPress = true;
      this.longPress.emit(event);
    }, 500); // tiempo en ms para considerar como "long press"
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    clearTimeout(this.timeoutId);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.isLongPress = false;
    this.timeoutId = setTimeout(() => {
      this.isLongPress = true;
      this.longPress.emit(event);
    }, 500);
  }

  @HostListener('touchend')
  onTouchEnd() {
    clearTimeout(this.timeoutId);
  }
}
