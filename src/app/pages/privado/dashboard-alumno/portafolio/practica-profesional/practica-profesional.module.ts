import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PracticaProfesionalPageRoutingModule } from './practica-profesional-routing.module';

import { PracticaProfesionalPage } from './practica-profesional.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PracticaProfesionalPageRoutingModule
  ],
  declarations: [PracticaProfesionalPage]
})
export class PracticaProfesionalPageModule {}
