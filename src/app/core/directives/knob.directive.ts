import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import * as $ from 'jquery';
import 'jquery-knob';

declare global {
  interface JQuery {
    knob: (options?: any) => JQuery;
  }
}

@Directive({
  selector: '[appKnob]'
})
export class KnobDirective implements OnChanges {

  @Input() bgColor!: string;
  @Input() fgColor!: string;
  @Input() width: number = 70;
  @Input() height: number = 70;
  @Input() number: any;
  private _created = false;

  constructor(private el: ElementRef) { }
  ngOnChanges(changes: any): void {
    if (!this._created) {
      $(this.el.nativeElement)
        .val(this.number)
        .knob({
          width: this.width,
          height: this.height,
          readOnly: true,
          bgColor: this.bgColor,
          fgColor: this.fgColor,
          thickness: .2,
          format: function (value: any) {
            return `${value}%`;
          }
        });
      this._created = true;
    }
    else {
      $(this.el.nativeElement).val(changes.number.currentValue);
      $(this.el.nativeElement).trigger('change');
    }
  }

}
