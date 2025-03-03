import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcuerdoTutorialPageRoutingModule } from './acuerdo-tutorial-routing.module';

import { AcuerdoTutorialPage } from './acuerdo-tutorial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcuerdoTutorialPageRoutingModule
  ],
  declarations: [AcuerdoTutorialPage]
})
export class AcuerdoTutorialPageModule {}
