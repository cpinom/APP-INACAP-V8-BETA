import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageDirective } from './image.directive';
import { DelegateDirective } from './delegate.directive';
import { KnobDirective } from './knob.directive';
import { LongPressDirective } from './long-press.directive';

@NgModule({
  declarations: [
    ImageDirective,
    DelegateDirective,
    KnobDirective,
    LongPressDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageDirective,
    DelegateDirective,
    KnobDirective,
    LongPressDirective
  ]
})
export class DirectivesModule { }
