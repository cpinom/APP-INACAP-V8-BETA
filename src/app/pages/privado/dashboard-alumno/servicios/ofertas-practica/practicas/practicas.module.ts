import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PracticasPageRoutingModule } from './practicas-routing.module';
import { PracticasPage } from './practicas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PracticasPageRoutingModule
  ],
  declarations: [PracticasPage]
})
export class PracticasPageModule { }
