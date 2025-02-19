import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AcuerdoTutorialPageRoutingModule } from './acuerdo-tutorial-routing.module';
import { AcuerdoTutorialPage } from './acuerdo-tutorial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AcuerdoTutorialPageRoutingModule
  ],
  declarations: [AcuerdoTutorialPage]
})
export class AcuerdoTutorialPageModule { }
