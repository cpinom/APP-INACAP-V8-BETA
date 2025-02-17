import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageDirective } from './image.directive';
import { DelegateDirective } from './delegate.directive';
import { KnobDirective } from './knob.directive';

@NgModule({
  declarations: [
    ImageDirective,
    DelegateDirective,
    KnobDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageDirective,
    DelegateDirective,
    KnobDirective
  ]
})
export class DirectivesModule { }
